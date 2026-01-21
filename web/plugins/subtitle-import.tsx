"use client";

import { definePlugin, DocumentActionComponent } from "sanity";

type Segment = { start: number; end: number; text: string };

function timeToSeconds(t: string): number {
  const m = t.trim().replace(",", ".").match(/(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const [, hh, mm, ss] = m;
  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
}

function parseSrt(content: string): Segment[] {
  const blocks = content.split(/\r?\n\r?\n/);
  const segments: Segment[] = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) continue;
    const timeLine = lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;
    const m = timeLine.match(/(.+?)\s+-->\s+(.+)/);
    if (!m) continue;
    const start = timeToSeconds(m[1]);
    const end = timeToSeconds(m[2]);
    const text = lines.slice(lines.indexOf(timeLine) + 1).join(" ").trim();
    if (!text) continue;
    segments.push({ start, end, text });
  }
  return segments;
}

function parseSbv(content: string): Segment[] {
  const blocks = content.split(/\r?\n\r?\n/);
  const segments: Segment[] = [];
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

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export const subtitleImportPlugin = definePlugin({
  name: "subtitle-import-action",
  document: {
    actions: (prevActions, context) => {
      const client = context.getClient({ apiVersion: "2024-10-01" });

      const ImportSubtitlesAction: DocumentActionComponent = (props) => {
        if (props.type !== "episode") return null;

        return {
          label: "Import subtitles (SRT/SBV)",
          onHandle: async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".srt,.sbv,text/plain";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              try {
                const text = await readFileAsText(file);
                const ext = file.name.toLowerCase().endsWith(".srt") ? "srt" : "sbv";
              const segments = ext === "srt" ? parseSrt(text) : parseSbv(text);
              if (!segments.length) {
                alert("字幕をパースできませんでした。");
                return;
              }
              const transcript = segments.map((s, idx) => ({
                _key: crypto.randomUUID(),
                _type: "transcriptSegment",
                segmentId: `file-${idx}`,
                text: s.text,
                start: s.start,
                end: s.end,
              }));

                const targetId =
                  props.draft?._id ||
                  (props.id.startsWith("drafts.") ? props.id : `drafts.${props.id}`);
                await client.patch(targetId).set({ transcript }).commit();
                alert(`字幕を読み込みました (${transcript.length} セグメント)。Publishしてください。`);
                props.onComplete();
              } catch (err) {
                console.error(err);
                alert("字幕の読み込みに失敗しました。コンソールを確認してください。");
              }
            };
            input.click();
          },
        };
      };

      return [...prevActions, ImportSubtitlesAction];
    },
  },
});
