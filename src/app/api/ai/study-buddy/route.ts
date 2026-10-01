import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { rankChunksWithBM25, type DocumentChunk } from "@/lib/bm25";

const requestSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
  question: z.string().min(2, "Question too short").max(500, "Question too long"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 questions per minute per user
    const rateCheck = await checkRateLimit(
      {
        keyPrefix: "ai-study-buddy",
        limit: 10,
        windowMs: 60 * 1000,
      },
      user.id
    );

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${rateCheck.reset} seconds before asking another question.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { courseId, question } = validation.data;

    // Fetch the course and all its lessons for genuine course-grounded RAG
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Chunk all lessons in this course
    const chunks: DocumentChunk[] = [];
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        // Split markdown content by double newline or markdown headers (### or ##)
        const paragraphs = les.markdownContent
          .split(/(?=\n#{1,3} )|\n\n+/)
          .map((p) => p.trim())
          .filter((p) => p.length > 40);

        if (paragraphs.length === 0 && les.markdownContent.trim().length > 0) {
          chunks.push({
            lessonId: les.id,
            lessonTitle: les.title,
            moduleTitle: mod.title,
            content: les.markdownContent.trim(),
          });
        } else {
          for (const p of paragraphs) {
            chunks.push({
              lessonId: les.id,
              lessonTitle: les.title,
              moduleTitle: mod.title,
              content: p,
            });
          }
        }
      }
    }

    // Perform BM25 ranking over all course lesson chunks
    const rankedResults = rankChunksWithBM25(chunks, question);

    // If query has no relevance to any lessons in the course, refuse out-of-course questions
    if (rankedResults.length === 0 || rankedResults[0].score < 0.25) {
      return NextResponse.json({
        answer: `I am specifically calibrated to answer questions strictly grounded in the course "${course.title}". Your question appears to be outside the material covered in this course's curriculum. Please feel free to ask about any concept, architecture, or code exercise in the syllabus!`,
        citation: null,
      });
    }

    // Take top 3 chunks
    const topChunks = rankedResults.slice(0, 3);
    const primaryCitation = topChunks[0].chunk.lessonTitle;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey || geminiApiKey === "sample_gemini_api_key") {
      return NextResponse.json(
        {
          error: "AI Study Buddy is currently offline. The GEMINI_API_KEY environment variable is not configured.",
        },
        { status: 503 }
      );
    }

    // Format retrieved context for Gemini
    const retrievedContextText = topChunks
      .map(
        (r, i) =>
          `[PASSAGE ${i + 1} from Lesson "${r.chunk.lessonTitle}" in Module "${r.chunk.moduleTitle}"]\n${r.chunk.content}`
      )
      .join("\n\n---\n\n");

    const systemPrompt = `You are the specialized IF/ELSE Intelligence AI Study Buddy for the course "${course.title}".
Your purpose is to assist students strictly based on the retrieved lesson passages below.
RULES:
1. ONLY answer using facts present in the retrieved passages.
2. Explicitly cite the lesson title "${primaryCitation}".
3. If the passages do not contain enough info to answer accurately, explicitly state: "The course lessons for ${course.title} do not cover this specific question."
4. Be concise, technically precise, and maintain the IF/ELSE Intelligence AI engineering standard.

RETRIEVED COURSE LESSON CONTENT:
${retrievedContextText}

STUDENT QUESTION:
${question}
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "AI Study Buddy encountered an error processing your query. Please try again shortly." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I was unable to synthesize a response from the lesson context.";

    return NextResponse.json({
      answer,
      citation: `Cited from: ${primaryCitation}`,
    });
  } catch (error: unknown) {
    console.error("Study Buddy error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while communicating with AI Study Buddy." },
      { status: 500 }
    );
  }
}
