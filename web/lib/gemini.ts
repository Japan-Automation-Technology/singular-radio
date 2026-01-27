import { clampScore } from "@/lib/comments";
import { GoogleGenAI } from "@google/genai";

export type GeminiSafety = {
  ok: boolean;
  labels: string[];
  confidence: number;
};

export type GeminiScores = {
  overall: number;
  safety: number;
  originality: number;
  specificity: number;
  constructive: number;
  community: number;
};

export type GeminiCommentScore = {
  safety: GeminiSafety;
  scores: GeminiScores;
  feature: boolean;
  rationale: string;
};

export type GeminiSummary = {
  summary: string;
};

function getEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export function hasGeminiConfig(): boolean {
  return Boolean(getEnv("GEMINI_API_KEY"));
}

export function getGeminiModel(): string {
  return getEnv("GEMINI_MODEL") ?? "gemini-3-flash-preview";
}

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (cachedClient) return cachedClient;
  const apiKey = getEnv("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

function extractJson(text: string): string | null {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
  return text.slice(firstBrace, lastBrace + 1);
}

function parseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string): Promise<string> {
  const client = getClient();
  const model = getGeminiModel();
  const response = await client.models.generateContent({
    model,
    contents: prompt,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
    },
  });
  const text = response?.text ?? "";
  return String(text).trim();
}

export async function scoreCommentWithGemini(params: {
  comment: string;
  videoTitle: string;
  videoSummary: string;
  transcriptSummary: string;
  authorHistory?: string;
}): Promise<GeminiCommentScore> {
  const prompt = `You are a strict comment evaluator for a YouTube community site.
Return only JSON.

Evaluation priorities:
1) Safety is absolute. If unsafe, mark safety.ok=false and feature=false.
2) Originality and specificity are next most important.
3) Other axes still matter but are secondary.

Scoring rules:
- scores are 0-100 integers.
- safety.score is 0-100 where higher means safer.
- overall should reflect the weighted importance above.

Context:
Video title: ${params.videoTitle}
Video summary: ${params.videoSummary}
Transcript summary: ${params.transcriptSummary}

Comment:
${params.comment}

Optional author history summary:
${params.authorHistory ?? "(none)"}

Return JSON with this schema:
{
  "safety": { "ok": boolean, "labels": [string], "confidence": number },
  "scores": {
    "overall": number,
    "safety": number,
    "originality": number,
    "specificity": number,
    "constructive": number,
    "community": number
  },
  "feature": boolean,
  "rationale": string
}`;

  const text = await callGemini(prompt);
  const jsonText = extractJson(text) ?? text;
  const parsed = parseJson<GeminiCommentScore>(jsonText);
  if (!parsed) {
    return {
      safety: { ok: false, labels: ["parse_error"], confidence: 1 },
      scores: {
        overall: 0,
        safety: 0,
        originality: 0,
        specificity: 0,
        constructive: 0,
        community: 0,
      },
      feature: false,
      rationale: "model_output_parse_error",
    };
  }

  return {
    safety: {
      ok: Boolean(parsed.safety?.ok),
      labels: Array.isArray(parsed.safety?.labels) ? parsed.safety.labels : [],
      confidence: Number(parsed.safety?.confidence ?? 0),
    },
    scores: {
      overall: clampScore(parsed.scores?.overall ?? 0),
      safety: clampScore(parsed.scores?.safety ?? 0),
      originality: clampScore(parsed.scores?.originality ?? 0),
      specificity: clampScore(parsed.scores?.specificity ?? 0),
      constructive: clampScore(parsed.scores?.constructive ?? 0),
      community: clampScore(parsed.scores?.community ?? 0),
    },
    feature: Boolean(parsed.feature),
    rationale: String(parsed.rationale ?? ""),
  };
}

export async function summarizeTranscriptWithGemini(params: {
  title: string;
  transcript: string;
}): Promise<GeminiSummary> {
  const prompt = `You are summarizing a YouTube episode transcript.
Return only JSON with { "summary": string }.

Title: ${params.title}
Transcript excerpt:
${params.transcript}

Write a 2-3 sentence summary in Japanese, concise and factual.`;

  const text = await callGemini(prompt);
  const jsonText = extractJson(text) ?? text;
  const parsed = parseJson<GeminiSummary>(jsonText);
  if (!parsed?.summary) {
    return { summary: "" };
  }
  return { summary: String(parsed.summary).trim() };
}
