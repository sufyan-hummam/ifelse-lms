export interface DocumentChunk {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  content: string;
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in",
  "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the",
  "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Standard BM25 (Best Matching 25) implementation
 * k1 = 1.2, b = 0.75
 */
export function rankChunksWithBM25(
  chunks: DocumentChunk[],
  query: string,
  k1 = 1.2,
  b = 0.75
): SearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || chunks.length === 0) {
    return [];
  }

  const N = chunks.length;
  const chunkTokens = chunks.map((c) => tokenize(c.content + " " + c.lessonTitle));
  const docLengths = chunkTokens.map((tokens) => tokens.length);
  const avgDocLength = docLengths.reduce((acc, len) => acc + len, 0) / N;

  // Calculate Document Frequency (DF) for each query term
  const df: Record<string, number> = {};
  for (const qTerm of queryTokens) {
    let count = 0;
    for (const tokens of chunkTokens) {
      if (tokens.includes(qTerm)) count++;
    }
    df[qTerm] = count;
  }

  // Calculate scores for each chunk
  const results: SearchResult[] = chunks.map((chunk, idx) => {
    const tokens = chunkTokens[idx];
    const docLength = docLengths[idx];

    // Term frequencies in this document
    const tf: Record<string, number> = {};
    for (const t of tokens) {
      tf[t] = (tf[t] || 0) + 1;
    }

    let score = 0;
    for (const qTerm of queryTokens) {
      const termDf = df[qTerm] || 0;
      if (termDf === 0) continue;

      // Robertson-Spärck Jones IDF
      const idf = Math.log((N - termDf + 0.5) / (termDf + 0.5) + 1);

      const termTf = tf[qTerm] || 0;
      const numerator = termTf * (k1 + 1);
      const denominator = termTf + k1 * (1 - b + b * (docLength / (avgDocLength || 1)));

      score += idf * (numerator / denominator);
    }

    return { chunk, score };
  });

  return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}
