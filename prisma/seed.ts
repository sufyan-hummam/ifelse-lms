import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import {
  Role,
  Level,
  LessonType,
  EnrollmentStatus,
  SubmissionStatus,
} from "../generated/prisma/client";

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  const seedDemo = process.env.SEED_DEMO === "true";

  if (isProduction) {
    console.error("⛔ ABORTED: Seeding demo accounts in production is forbidden.");
    process.exit(1);
  }

  if (!seedDemo) {
    console.error("⚠️ SEED_DEMO=true is required to run the seed script with demo accounts.");
    console.error("Run with: $env:SEED_DEMO=\"true\"; npx prisma db seed (or npm run db:seed with SEED_DEMO=true)");
    process.exit(1);
  }

  console.log("🌱 Starting realistic seed for IF/ELSE Intelligence LMS...");

  // 1. Clean existing records in correct relation order
  await db.review.deleteMany();
  await db.certificate.deleteMany();
  await db.submission.deleteMany();
  await db.assignment.deleteMany();
  await db.option.deleteMany();
  await db.question.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.quiz.deleteMany();
  await db.lessonProgress.deleteMany();
  await db.lesson.deleteMany();
  await db.module.deleteMany();
  await db.pathCourse.deleteMany();
  await db.learningPath.deleteMany();
  await db.enrollment.deleteMany();
  await db.announcement.deleteMany();
  await db.course.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 2. Create Users
  const admin = await db.user.create({
    data: {
      email: "admin@ifelseintelligence.com",
      name: "Dr. Sarah Chen",
      role: Role.ADMIN,
      headline: "Director of AI Research & Head of LMS",
      bio: "Ph.D. in Machine Learning from Stanford. Former senior research scientist working on scalable neural retrieval and agent architectures.",
      githubUrl: "https://github.com/ifelseintelligence",
      linkedinUrl: "https://linkedin.com/company/ifelse-intelligence",
      password: passwordHash,
      streakCount: 14,
    },
  });

  const instructor = await db.user.create({
    data: {
      email: "instructor@ifelseintelligence.com",
      name: "Tariq Mansoor",
      role: Role.INSTRUCTOR,
      headline: "Principal AI Systems Architect",
      bio: "12+ years engineering large-scale distributed systems, multimodal inference pipelines, and enterprise RAG deployments at IF/ELSE Intelligence.",
      githubUrl: "https://github.com/ifelseintelligence",
      linkedinUrl: "https://linkedin.com/company/ifelse-intelligence",
      password: passwordHash,
      streakCount: 28,
    },
  });

  const student = await db.user.create({
    data: {
      email: "student@ifelseintelligence.com",
      name: "Alex Rivera",
      role: Role.STUDENT,
      headline: "Applied AI Engineer Fellow",
      bio: "Building production RAG and agent workflows. Passionate about neural search, vector databases, and deterministic agent systems.",
      githubUrl: "https://github.com/alexrivera-ai",
      linkedinUrl: "https://linkedin.com/in/alexrivera",
      password: passwordHash,
      streakCount: 7,
    },
  });

  console.log("✅ Created 3 core users (Admin, Instructor, Student)");

  // 3. Create Course 1: Production RAG Systems
  const courseRAG = await db.course.create({
    data: {
      title: "Production RAG Systems & Vector Architectures",
      slug: "production-rag-systems",
      shortDescription:
        "Architect enterprise-grade Retrieval-Augmented Generation systems with hybrid search, reranking, and quantitative Ragas evaluation.",
      description:
        "Most tutorials teach naïve RAG: take a chunk, embed it, search cosine similarity, and dump it into an LLM context. In production, this fails silently with hallucinated sources, context fragmentation, and degraded recall. This course takes you inside real IF/ELSE client architectures: contextual chunking, parent-document retrieval, dense-sparse hybrid search with Reciprocal Rank Fusion (RRF), cross-encoder rerankers, and automated evaluation metrics.",
      coverImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      level: Level.ADVANCED,
      category: "RAG & GenAI",
      published: true,
      approved: true,
      durationMinutes: 480,
      price: 0,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Foundations of High-Recall Neural Retrieval",
            description: "Embedding spaces, geometric limitations, and semantic chunking.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Vector Embeddings & Semantic Geometry",
                  slug: "vector-embeddings-and-geometry",
                  order: 1,
                  contentType: LessonType.TEXT,
                  durationMinutes: 20,
                  isFreePreview: true,
                  markdownContent: `## Beyond Naïve Vector Search

In production retrieval-augmented generation (RAG), vector similarity is rarely sufficient on its own. While dense vector models (e.g. \`text-embedding-3-large\`, \`bge-en-v1.5\`) excel at semantic paraphrasing, they frequently fail on keyword-exact technical queries, serial numbers, entity names, and short domain acronyms.

\`\`\`python
import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two embedding vectors."""
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))
\`\`\`

### The Embedding Bottleneck
When compressing 512 tokens into a single 1536-dimensional vector, high-frequency details are squashed. To combat this in the IF/ELSE production stack, we enforce:
1. **Contextual Document Chunking**: Prepending document title and section summaries to each child chunk.
2. **Dense-Sparse Hybrid Indexing**: Coupling BM25 inverted indexes with HNSW vector indices.
3. **Cross-Encoder Reranking**: Re-scoring top 50 candidates using full cross-attention.
`,
                },
                {
                  title: "Contextual Chunking in Python",
                  slug: "contextual-chunking-in-python",
                  order: 2,
                  contentType: LessonType.CODE_PLAYGROUND,
                  language: "python",
                  durationMinutes: 25,
                  isFreePreview: true,
                  codeSnippet: `def create_contextual_chunks(document_title: str, text: str, chunk_size: int = 250, overlap: int = 50):
    words = text.split(" ")
    chunks = []
    start = 0
    
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_body = " ".join(words[start:end])
        # Prepend contextual header to prevent semantic isolation
        contextual_chunk = f"DOCUMENT: {document_title}\\nCONTEXT: Section {len(chunks) + 1}\\nCONTENT: {chunk_body}"
        chunks.append(contextual_chunk)
        if end == len(words):
            break
        start += (chunk_size - overlap)
        
    return chunks

# Test the chunker
sample_doc = "IF/ELSE Intelligence designs custom AI systems. RAG pipelines combine semantic vector retrieval with deterministic business rules to prevent hallucination."
chunks = create_contextual_chunks("AI Architecture Manual", sample_doc, chunk_size=10, overlap=3)
print(f"Generated {len(chunks)} chunks:")
for i, c in enumerate(chunks):
    print(f"--- Chunk {i+1} ---\\n{c}\\n")
`,
                  markdownContent: `## Interactive Playground: Contextual Chunking

In this lesson you will inspect how chunking affects retrieval recall. Naïve splitting breaks sentences across arbitrary boundaries. Contextual chunking injects parent document metadata directly into the vector payload.

Execute the Python code below to see how chunk boundaries and contextual headers are structured.`,
                },
              ],
            },
          },
          {
            title: "Dense-Sparse Hybrid Search & RRF",
            description: "Combining lexical BM25 and dense vector search with Reciprocal Rank Fusion.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Reciprocal Rank Fusion (RRF) Theory & Implementation",
                  slug: "reciprocal-rank-fusion-rrf",
                  order: 1,
                  contentType: LessonType.TEXT,
                  durationMinutes: 30,
                  isFreePreview: false,
                  markdownContent: `## Reciprocal Rank Fusion (RRF)

When combining rankings from disparate search retrieval methods (e.g. BM25 score ranging from 0 to 45, and Cosine similarity ranging from -1 to 1), raw scores cannot be directly summed because their distributions and scales differ drastically.

**Reciprocal Rank Fusion** solves this by using rank order rather than raw score:

$$RRF(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

Where:
- $M$ is the set of retrieval models (e.g., BM25 and Dense Vector).
- $r_m(d)$ is the rank of document $d$ in system $m$ (1-indexed).
- $k$ is a smoothing constant, typically set to $60$.

### Why $k=60$?
Empirical studies by Cormack et al. demonstrated that $k=60$ mitigates the outsized influence of high-ranking outliers while still prioritizing documents that appear near the top of both retrieval lists.`,
                },
                {
                  title: "Quiz: Hybrid Search & Retrieval Metrics",
                  slug: "quiz-hybrid-search-metrics",
                  order: 2,
                  contentType: LessonType.QUIZ,
                  durationMinutes: 20,
                  isFreePreview: false,
                  markdownContent: `Test your mastery of hybrid search, vector indices, and Reciprocal Rank Fusion. You must score 75% or higher to pass.`,
                },
              ],
            },
          },
          {
            title: "Production Evaluation & Capstone",
            description: "Quantitative evaluation using Ragas and final system submission.",
            order: 3,
            lessons: {
              create: [
                {
                  title: "Evaluation Metrics: Faithfulness & Context Precision",
                  slug: "rag-evaluation-metrics",
                  order: 1,
                  contentType: LessonType.TEXT,
                  durationMinutes: 25,
                  isFreePreview: false,
                  markdownContent: `## The Ragas Metric Framework

To reliably deploy RAG systems to production without fear of hallucinations, IF/ELSE Intelligence leverages quantitative evaluation pipelines:

1. **Faithfulness**: Measures whether the generated answer can be strictly inferred from the retrieved context without ungrounded extrapolations.
2. **Answer Relevance**: Measures whether the response directly addresses the user's intent without superfluous filler.
3. **Context Precision**: Ratio of relevant chunks in the retrieved context to total chunks returned.
4. **Context Recall**: Verifies if all requisite knowledge needed to answer the query was successfully retrieved.`,
                },
                {
                  title: "Capstone Assignment: Enterprise RAG Architecture",
                  slug: "capstone-assignment-rag",
                  order: 2,
                  contentType: LessonType.TEXT,
                  durationMinutes: 60,
                  isFreePreview: false,
                  markdownContent: `## Capstone Assignment: Enterprise RAG Architecture

You are tasked with submitting an architecture document and code repository for a multi-tenant enterprise RAG system that supports:
- PDF document parsing with tables and figures
- Hybrid BM25 + pgvector retrieval
- Cross-encoder reranker
- Guardrail validation step before delivering response to end-user.

Submit your GitHub repository link and architecture brief below.`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Attach Quiz to Course 1 Lesson 4
  const rrfQuizLesson = await db.lesson.findFirst({
    where: { slug: "quiz-hybrid-search-metrics" },
  });

  if (rrfQuizLesson) {
    const quiz1 = await db.quiz.create({
      data: {
        lessonId: rrfQuizLesson.id,
        title: "Hybrid Search & Neural Retrieval Mastery",
        description: "Assess your understanding of reciprocal rank fusion, vector geometries, and reranking trade-offs.",
        passingScore: 75,
        questions: {
          create: [
            {
              questionText:
                "Why can BM25 scores and vector cosine similarities not be directly added together in naïve hybrid search?",
              order: 1,
              explanation:
                "BM25 scores are unbounded positive numbers based on term frequency and inverted document frequency, whereas cosine similarity is normalized between -1.0 and 1.0. Directly summing them gives BM25 massive unintended dominance.",
              options: {
                create: [
                  {
                    optionText:
                      "Because BM25 scores are unbounded and non-normalized, while cosine similarities are bounded between -1 and 1.",
                    isCorrect: true,
                    explanation: "Correct. Their distributions and ranges differ completely.",
                  },
                  {
                    optionText: "Because BM25 only works in Python 2.7.",
                    isCorrect: false,
                  },
                  {
                    optionText: "Because vector embeddings only support integer arithmetic.",
                    isCorrect: false,
                  },
                  {
                    optionText: "Because cosine similarity requires Euclidean coordinates.",
                    isCorrect: false,
                  },
                ],
              },
            },
            {
              questionText:
                "In Reciprocal Rank Fusion (RRF), what is the standard empirical smoothing constant 'k' recommended in literature?",
              order: 2,
              explanation: "Cormack et al. empirically established k=60 as the optimal smoothing parameter.",
              options: {
                create: [
                  { optionText: "k = 60", isCorrect: true },
                  { optionText: "k = 1", isCorrect: false },
                  { optionText: "k = 1000", isCorrect: false },
                  { optionText: "k = 0", isCorrect: false },
                ],
              },
            },
            {
              questionText:
                "Which Ragas metric specifically evaluates whether an LLM's generated response is strictly derived from retrieved chunks without hallucination?",
              order: 3,
              explanation: "Faithfulness calculates the fraction of claims in the generated answer that are grounded in the retrieved context.",
              options: {
                create: [
                  { optionText: "Faithfulness", isCorrect: true },
                  { optionText: "Context Recall", isCorrect: false },
                  { optionText: "Latency Index", isCorrect: false },
                  { optionText: "Token Compression Ratio", isCorrect: false },
                ],
              },
            },
            {
              questionText:
                "What is the main operational advantage of a bi-encoder vs a cross-encoder in retrieval?",
              order: 4,
              explanation:
                "Bi-encoders allow independent offline document embedding and sub-millisecond approximate nearest neighbor search, whereas cross-encoders require full joint self-attention across query and document pairs.",
              options: {
                create: [
                  {
                    optionText:
                      "Bi-encoders allow offline document embedding and rapid vector indexing, whereas cross-encoders cannot pre-embed documents.",
                    isCorrect: true,
                  },
                  {
                    optionText: "Bi-encoders have zero memory footprint.",
                    isCorrect: false,
                  },
                  {
                    optionText: "Cross-encoders cannot be run on GPUs.",
                    isCorrect: false,
                  },
                  {
                    optionText: "Bi-encoders do not use neural networks.",
                    isCorrect: false,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Record Alex's passing attempt on this quiz
    await db.quizAttempt.create({
      data: {
        quizId: quiz1.id,
        userId: student.id,
        score: 100,
        passed: true,
        answersJson: JSON.stringify({ q1: 0, q2: 0, q3: 0, q4: 0 }),
      },
    });
  }

  // Attach Assignment to Capstone Lesson
  const capstoneLesson = await db.lesson.findFirst({
    where: { slug: "capstone-assignment-rag" },
  });

  if (capstoneLesson) {
    const assignment = await db.assignment.create({
      data: {
        lessonId: capstoneLesson.id,
        title: "Enterprise RAG Pipeline Implementation",
        description:
          "Implement a complete Python/TypeScript retrieval pipeline featuring hybrid search, contextual chunking, and automated evaluation.",
        instructions:
          "1. Fork the IF/ELSE RAG starter template.\n2. Implement contextual chunking.\n3. Integrate hybrid dense-sparse search with RRF.\n4. Run evaluation with Ragas and achieve > 0.85 faithfulness.\n5. Submit repository URL and architecture brief.",
        rubric:
          "- Code correctness and architecture (40%)\n- Hybrid search implementation (30%)\n- Faithfulness > 0.85 (20%)\n- Documentation & testing (10%)",
      },
    });

    // Create a graded submission for Alex
    await db.submission.create({
      data: {
        assignmentId: assignment.id,
        userId: student.id,
        content:
          "https://github.com/alexrivera-ai/enterprise-rag-pipeline\n\nArchitecture Brief: Deployed pgvector with BGE-M3 dense embeddings and BM25 full text search. Implemented custom RRF with k=60 and Cohere Rerank v3. Ragas evaluation achieved 0.92 Faithfulness and 0.88 Context Precision across 150 test queries.",
        status: SubmissionStatus.GRADED,
        grade: 95.0,
        feedback:
          "Exceptional implementation. Your reciprocal rank fusion implementation cleanly combines dense vector distance with BM25 weights, and the test suite is thorough.",
        gradedById: instructor.id,
        gradedAt: new Date(),
      },
    });
  }

  // 4. Create Course 2: Applied Computer Vision with Vision-Language Models
  const courseCV = await db.course.create({
    data: {
      title: "Applied Computer Vision & Vision-Language Systems",
      slug: "applied-computer-vision-vlm",
      shortDescription:
        "Deploy high-throughput vision pipelines with YOLOv11, Segment Anything (SAM-2), and multimodal vision-language models.",
      description:
        "From defect detection on factory lines to automated invoice parsing and aerial inspection, modern vision applications require blending real-time object detection with reasoning-capable Vision-Language Models (VLMs). Learn how to fine-tune YOLO models, deploy SAM-2 for zero-shot instance segmentation, and orchestrate multimodal models for visual question answering.",
      coverImage:
        "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
      level: Level.INTERMEDIATE,
      category: "Computer Vision",
      published: true,
      approved: true,
      durationMinutes: 360,
      price: 0,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Modern Object Detection & Zero-Shot Segmentation",
            description: "YOLOv11 architectures and SAM-2 video/image segmentation.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "YOLOv11 Architecture & Real-Time Inference",
                  slug: "yolov11-architecture-inference",
                  order: 1,
                  contentType: LessonType.TEXT,
                  durationMinutes: 25,
                  isFreePreview: true,
                  markdownContent: `## Real-Time Vision with YOLOv11

Computer vision in industrial environments demands low-latency inference on edge hardware (NVIDIA Jetson, Intel OpenVINO, or TensorRT).

\`\`\`python
from ultralytics import YOLO

# Load model with TensorRT export capability
model = YOLO("yolo11x.pt")

# Perform inference with confidence thresholding and NMS
results = model.predict(
    source="camera_feed_01.mp4",
    conf=0.45,
    iou=0.6,
    device="cuda:0"
)

for result in results:
    boxes = result.boxes
    print(f"Detected {len(boxes)} items in frame.")
\`\`\`
`,
                },
                {
                  title: "SAM-2 Promptable Segmentation",
                  slug: "sam-2-promptable-segmentation",
                  order: 2,
                  contentType: LessonType.CODE_PLAYGROUND,
                  language: "python",
                  durationMinutes: 30,
                  isFreePreview: true,
                  codeSnippet: `import numpy as np

def generate_bounding_box_prompts(mask_predictions):
    """Calculate axis-aligned bounding boxes from binary segmentation masks."""
    bboxes = []
    for mask in mask_predictions:
        y_indices, x_indices = np.where(mask > 0.5)
        if len(x_indices) > 0 and len(y_indices) > 0:
            x_min, x_max = np.min(x_indices), np.max(x_indices)
            y_min, y_max = np.min(y_indices), np.max(y_indices)
            bboxes.append([x_min, y_min, x_max, y_max])
    return bboxes

# Simulated mask
simulated_mask = np.zeros((100, 100))
simulated_mask[20:60, 30:70] = 1.0
boxes = generate_bounding_box_prompts([simulated_mask])
print("Derived Bounding Box Prompt [x_min, y_min, x_max, y_max]:", boxes)
`,
                  markdownContent: `## Interactive Playground: SAM-2 Segmentation Prompts

Promptable segmentation allows users or downstream agents to click, draw bounding boxes, or supply text prompts to segment objects. Run the script below to see bounding box derivation.`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Create Course 3: Autonomous AI Agents & Tool-Use Workflows
  const courseAgents = await db.course.create({
    data: {
      title: "Autonomous AI Agents & Tool-Use Workflows",
      slug: "autonomous-ai-agents",
      shortDescription:
        "Engineer deterministic, robust AI agent loops using state machines, function calling, memory persistence, and human-in-the-loop escalation.",
      description:
        "Moving beyond fragile chatbots requires thinking in graphs, state machines, and rigorous tool interfaces. Learn how to architect multi-agent systems, prevent infinite execution loops, persist memory across long conversations, and implement verifiable human-in-the-loop review.",
      coverImage:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      level: Level.INTERMEDIATE,
      category: "AI Systems",
      published: true,
      approved: true,
      durationMinutes: 420,
      price: 0,
      instructorId: instructor.id,
      modules: {
        create: [
          {
            title: "Deterministic Agent State Machines",
            description: "Designing agent loops that never fail silently.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "The Agent Loop: Sense, Reason, Act, Reflect",
                  slug: "agent-loop-fundamentals",
                  order: 1,
                  contentType: LessonType.TEXT,
                  durationMinutes: 20,
                  isFreePreview: true,
                  markdownContent: `## The Anatomy of a Robust Agent Loop

An autonomous agent is fundamentally an infinite state loop mediated by an LLM reasoning engine:

1. **Sense**: Ingest state, environment observation, and user directives.
2. **Reason**: Determine if a terminal condition has been reached or if a tool must be called.
3. **Act**: Execute tool call with validated JSON schema.
4. **Reflect**: Parse execution result, update memory, and handle exceptions.

\`\`\`typescript
type AgentState = {
  messages: Array<{ role: string; content: string }>;
  toolsAvailable: Tool[];
  iterationCount: number;
  maxIterations: number;
  isComplete: boolean;
};

export async function stepAgent(state: AgentState): Promise<AgentState> {
  if (state.iterationCount >= state.maxIterations) {
    throw new Error("Loop safety triggered: Maximum agent iterations reached.");
  }
  // Execute LLM call with structured tool binding...
  return { ...state, iterationCount: state.iterationCount + 1 };
}
\`\`\`
`,
                },
                {
                  title: "Tool Validation with Strict Zod Schemas",
                  slug: "tool-validation-with-zod",
                  order: 2,
                  contentType: LessonType.CODE_PLAYGROUND,
                  language: "typescript",
                  durationMinutes: 25,
                  isFreePreview: true,
                  codeSnippet: `import { z } from "zod";

const DatabaseQueryToolSchema = z.object({
  action: z.enum(["select", "count", "aggregate"]),
  table: z.enum(["users", "courses", "enrollments"]),
  filterKey: z.string().optional(),
  filterValue: z.union([z.string(), z.number()]).optional(),
  limit: z.number().min(1).max(100).default(20),
});

type QueryInput = z.infer<typeof DatabaseQueryToolSchema>;

function validateAgentToolInput(rawInput: unknown): QueryInput {
  const result = DatabaseQueryToolSchema.safeParse(rawInput);
  if (!result.success) {
    throw new Error(\`Tool Validation Failed: \${result.error.message}\`);
  }
  return result.data;
}

// Test validation
const testInput = {
  action: "select",
  table: "courses",
  limit: 5,
};

console.log("Validated Tool Payload:", validateAgentToolInput(testInput));
`,
                  markdownContent: `## Interactive Playground: Tool Schema Validation

LLMs will occasionally hallucinate parameters or emit invalid types. Validating tool arguments with strict schemas is non-negotiable for safe production agents.`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created 3 rich courses with modules, lessons, playgrounds, and quizzes");

  // 6. Create 2 Learning Paths with IF/ELSE prerequisite logic
  await db.learningPath.create({
    data: {
      title: "Applied AI Engineer",
      slug: "applied-ai-engineer",
      shortDescription:
        "The flagship pathway from foundational agentic state machines to enterprise-scale RAG systems.",
      description:
        "Become an applied AI engineer capable of designing, evaluating, and deploying production intelligent software. Master agentic function calling, vector indexes, hybrid retrieval, and latency optimization.",
      estimatedHours: 45,
      published: true,
      courses: {
        create: [
          {
            courseId: courseAgents.id,
            order: 1,
            // Prerequisite: null (Start here!)
          },
          {
            courseId: courseRAG.id,
            order: 2,
            prerequisiteCourseId: courseAgents.id, // IF Agents complete THEN unlock RAG ELSE locked!
          },
        ],
      },
    },
  });

  await db.learningPath.create({
    data: {
      title: "Multimodal Intelligence Specialist",
      slug: "multimodal-intelligence-specialist",
      shortDescription:
        "Master real-world visual perception, YOLO architectures, and multimodal RAG pipelines.",
      description:
        "Bridge the gap between raw pixels and semantic understanding. Train models on custom vision datasets, implement promptable segmentation, and fuse visual embeddings into enterprise knowledge bases.",
      estimatedHours: 35,
      published: true,
      courses: {
        create: [
          {
            courseId: courseCV.id,
            order: 1,
          },
          {
            courseId: courseRAG.id,
            order: 2,
            prerequisiteCourseId: courseCV.id, // IF CV complete THEN unlock RAG ELSE locked!
          },
        ],
      },
    },
  });

  console.log("✅ Created 2 learning paths with conditional prerequisite logic");

  // 7. Create Student Enrollments, Progress, and Certificate
  // Alex is enrolled in Course 1 (in progress 50%)
  await db.enrollment.create({
    data: {
      userId: student.id,
      courseId: courseRAG.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercentage: 50.0,
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  // Mark first two lessons as completed
  const ragLessons = await db.lesson.findMany({
    where: { module: { courseId: courseRAG.id } },
    orderBy: { order: "asc" },
  });

  if (ragLessons.length > 0) {
    await db.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: ragLessons[0].id,
        completed: true,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: "Remember: BGE-M3 handles dense and sparse simultaneously. Very useful for multilingual documents.",
        isBookmarked: true,
      },
    });
  }

  if (ragLessons.length > 1) {
    await db.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: ragLessons[1].id,
        completed: true,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes: "Contextual headers reduce ambiguity when retrieving small chunks from large legal PDFs.",
        isBookmarked: false,
      },
    });
  }

  // Alex completed Course 3 (100% progress) and holds a Certificate!
  await db.enrollment.create({
    data: {
      userId: student.id,
      courseId: courseAgents.id,
      status: EnrollmentStatus.COMPLETED,
      progressPercentage: 100.0,
      enrolledAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const agentLessons = await db.lesson.findMany({
    where: { module: { courseId: courseAgents.id } },
  });

  for (const l of agentLessons) {
    await db.lessonProgress.create({
      data: {
        userId: student.id,
        lessonId: l.id,
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Generate verified Certificate for Alex on Autonomous AI Agents
  await db.certificate.create({
    data: {
      certificateNumber: "IFELSE-CERT-2026-9481A",
      userId: student.id,
      courseId: courseAgents.id,
      verificationHash: "f83a902b1c4e88e7d23a1099684be3912ca87641dfb90c37184a6217",
      issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      pdfUrl: null,
    },
  });

  // 8. Reviews & Announcements
  await db.review.create({
    data: {
      courseId: courseAgents.id,
      userId: student.id,
      rating: 5,
      comment:
        "The focus on deterministic state machines and strict Zod validation completely changed how our team approaches LLM agent systems. Real production engineering, zero fluffy hype.",
    },
  });

  await db.announcement.create({
    data: {
      title: "New AI Study Buddy & Interactive Playground Online",
      content:
        "Welcome to the IF/ELSE Intelligence LMS portal! You can now ask questions directly to the course-grounded AI Study Buddy inside any lesson player, or experiment with live code blocks.",
      authorId: instructor.id,
      courseId: courseRAG.id,
    },
  });

  await db.announcement.create({
    data: {
      title: "Global AI Engineering Cohort Opening Soon",
      content:
        "Applications for the next intensive Applied AI Engineering cohort are now live. All enrolled students have access to the learning paths and skill-graph progress maps.",
      authorId: admin.id,
      courseId: null, // Global announcement
    },
  });

  console.log("✅ Seed completed successfully with realistic production data!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
