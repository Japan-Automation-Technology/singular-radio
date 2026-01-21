#!/usr/bin/env node
/**
 * Import subtitles (SRT or SBV) into Sanity episode.transcript.
 *
 * Usage:
 *   node scripts/import-subtitles.js --file path/to/file.srt --slug <episode-slug> [--dataset production]
 *
 * Env:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID (required)
 *   SANITY_WRITE_TOKEN (required)
 *   SANITY_API_VERSION (default 2024-10-01)
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].replace(/^--/, "");
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

function timeToSeconds(t) {
  // supports "00:00:01,000" or "0:00:01.000" etc.
  const m = t.trim().replace(",", ".").match(/(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const [, hh, mm, ss] = m;
  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
}

function parseSrt(content) {
  const blocks = content.split(/\r?\n\r?\n/);
  const segments = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) continue;
    const timeLine = lines[1].includes("-->") ? lines[1] : lines[0];
    const m = timeLine.match(/(.+?)\s+-->\s+(.+)/);
    if (!m) continue;
    const start = timeToSeconds(m[1]);
    const end = timeToSeconds(m[2]);
    const textLines = lines.slice(timeLine === lines[1] ? 2 : 1);
    const text = textLines.join(" ").trim();
    if (!text) continue;
    segments.push({ start, end, text });
  }
  return segments;
}

function parseSbv(content) {
  const blocks = content.split(/\r?\n\r?\n/);
  const segments = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) continue;
    const timeLine = lines[0];
    const parts = timeLine.split(",");
    if (parts.length < 2) continue;
    const start = timeToSeconds(parts[0]);
    const end = timeToSeconds(parts[1]);
    const text = lines.slice(1).join(" ").trim();
    if (!text) continue;
    segments.push({ start, end, text });
  }
  return segments;
}

function parseSubtitles(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".srt") return parseSrt(content);
  if (ext === ".sbv") return parseSbv(content);
  throw new Error("Unsupported subtitle format. Use .srt or .sbv");
}

async function main() {
  const { file, slug, dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production" } = parseArgs();
  if (!file || !slug) {
    console.error("Usage: node scripts/import-subtitles.js --file <file.srt|sbv> --slug <episode-slug>");
    process.exit(1);
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_WRITE_TOKEN;
  const apiVersion = process.env.SANITY_API_VERSION || "2024-10-01";
  if (!projectId || !token) {
    console.error("Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN are required.");
    process.exit(1);
  }

  const segments = parseSubtitles(file);
  if (!segments.length) {
    console.error("No segments parsed from file.");
    process.exit(1);
  }

  const transcript = segments.map((s, idx) => ({
    _key: randomUUID(),
    _type: "transcriptSegment",
    segmentId: `file-${idx}`,
    text: s.text,
    start: s.start,
    end: s.end,
  }));

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const episode = await client.fetch(
    `*[_type == "episode" && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (!episode?._id) {
    console.error("Episode not found for slug:", slug);
    process.exit(1);
  }

  await client.patch(episode._id).set({ transcript }).commit();
  console.log(`Imported ${transcript.length} segments into episode ${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
