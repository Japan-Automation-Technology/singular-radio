# Singular Radio – Website MVP Design & Implementation Plan

Status: draft (Jan 20, 2026)  
Scope: MVP site inspired by dwarkesh.com + tesradio.jp, with “Learn” terminology hub, easy episode ingestion using provided timestamped JSON subtitles, and podcast RSS.

## Goals
- Launch a fast, content-first site with Home / Episodes / Episode detail / Learn / Community / Sponsors / About.
- Minimize editor workload when adding new episodes: reuse existing subtitle JSON, auto-link Learn terms, reuse podcast RSS metadata.
- Keep architecture future-proof for comments/leaderboard and sponsor integrations.

## Architecture (proposed)
- Frontend: Next.js 15 (App Router) + React Server Components. Styling via TailwindCSS. Deploy on Vercel with ISR.
- CMS: Sanity v3 (hosted) for structured content and Studio. Reasons: flexible block marks for timestamps + term refs, quick Studio forms, free tier, webhooks to trigger ISR.
- Optional backend augmentations: Supabase (auth + comments later), or keep comments static until phase 2.
- Analytics: Plausible/umami. Email subscribe: existing Substack embed or API call.

## Information Architecture
- `/` Home: latest episode hero (play/embed + listen buttons), featured Learn terms, top community comment, sponsor strip.
- `/episodes`: searchable/filterable list (title, guest, tags, published date). Pagination.
- `/episodes/[slug]`: hero with YouTube embed + listen CTAs, transcript with timestamp jump, inline Learn tooltips, “Terms in this episode” side rail, show notes, related episodes. Comments placeholder.
- `/learn`: searchable list of terms with categories. `/learn/[slug]`: definitions, related terms, occurrences table (episode + timestamp link).
- `/community`: leaderboard (weekly/all-time) + recent comments feed (static/dummy for MVP).
- `/sponsors`: media kit + contact form. `/about`: mission, hosts, social links.

## Content Model (Sanity schema draft)
- `episode`  
  - title, slug, guest[] (name, role, link), publishedAt, duration, coverImage  
  - youtubeUrl, spotifyUrl, appleUrl  
  - tags[]  
  - transcript: PortableText blocks with custom marks:  
    - `timestamp` (string “mm:ss” or seconds)  
    - `learnRef` (reference to learnTerm)  
  - showNotes[] (rich text), relatedEpisodes[]  
  - learnRefs[] (derived)  
  - ingestMeta: source (“rss” | “manual”), originalId.
- `learnTerm`  
  - title, slug, shortDef, longDef, category[], related[]  
  - occurrences[]: {episodeRef, timestamp, excerpt}
- `comment` (phase 2)  
  - episodeRef, user, text, sentimentTag, likes, createdAt
- `leaderboardSnapshot` (phase 2)  
  - commentRef, score, period (“week”, “alltime”), computedAt
- `sponsor`  
  - name, logo, blurb, link, activeRange

## Ingestion Flow (optimize for your existing JSON subtitles)
1) **Create episode shell from RSS**  
   - Script pulls from `https://anchor.fm/s/103ddc418/podcast/rss`. Fields: title, pubDate, enclosure (audio), description. Populate episode doc (status: draft, no transcript yet).  
2) **Upload transcript JSON**  
   - Input format: array of segments with `manualOverride` (text) and `manualTiming` {start,end}.  
   - Script transforms to PortableText blocks: one block per segment, attach `timestamp` mark using `manualTiming.start` (seconds → “mm:ss”).  
   - Optional: merge adjacent short segments (<2s) for readability.  
3) **Auto-suggest Learn tagging** (optional helper)  
   - Maintain a dictionary of known terms.  
   - Script scans transcript text, adds `learnRef` mark suggestions; editor reviews in Studio.  
4) **Publish**  
   - Editor reviews transcript, adds Learn links where needed, hits Publish.  
   - Sanity webhook triggers Vercel ISR to refresh `/episodes/[slug]`, `/episodes`, `/learn`.

## UI Behavior (MVP)
- Transcript lines show timestamp chip (click to seek). Inline Learn highlights show tooltip (shortDef + “Read on Learn” link).  
- Desktop: right rail “Terms in this episode”. Mobile: collapsible section.  
- Episodes list: search by title/guest/tag; sort by date descending.  
- Learn list: search + category chips. Term page shows all occurrences with jump links back to episode + timestamp hash (`/episodes/[slug]#t=756`).
- Community: static leaderboard cards with dummy data; clear CTA “Full commenting coming soon”.

## Data Contracts / Formats
- **Subtitle JSON → internal segment:**  
  - Input: `{ id, manualOverride: string, manualTiming: {start: number, end: number} }`  
  - Output block example (pseudo):  
    ```json
    {
      "_type": "block",
      "style": "normal",
      "markDefs": [{ "_key": "t1", "_type": "timestamp", "value": 123.4 }],
      "children": [{ "_type": "span", "text": "さあ始まりました...", "marks": ["t1"] }]
    }
    ```
- **Timestamp formatting:** display `mm:ss` if <1h else `hh:mm:ss`; hash link `#t=<seconds>`.

## Scripts to build (priority)
1) `scripts/import-rss.ts`: ingest RSS, create/update episode docs (draft).  
2) `scripts/import-transcript-json.ts`: consume provided JSON file, attach to target episode by slug, push to Sanity.  
3) (Optional) `scripts/suggest-learn-tags.ts`: use term dictionary to add suggested marks.  
Provide CLI prompts for paths and episode slug to minimize manual edits.

## Implementation Plan (MVP timeline)
- Day 0.5: Repo setup (Next.js, Tailwind), layout with nav (Home, About, Episodes, Community, Sponsors, Learn).  
- Day 1: Sanity schemas for episode/learnTerm; ISR + webhook wiring; Episodes list & detail (YouTube embed, transcript render, Learn tooltips).  
- Day 1.5: Learn list/detail pages; right-rail terms; basic SEO/OG.  
- Day 2: Community placeholder leaderboard; Sponsors/About static pages; polish styles, dark mode.  
- Day 2.5: RSS + transcript import scripts; document editorial workflow.  
- After launch: comments + leaderboard computation, search indexing (Meilisearch/Algolia), auth.

## Editorial Workflow (once implemented)
1) Run `import-rss` to seed new episode entries.  
2) For each episode, run `import-transcript-json --slug <slug> --file <path>`.  
3) In Sanity Studio, open the episode:  
   - Review transcript, add/confirm Learn highlights.  
   - Add cover image and tags.  
   - Publish.  
4) (Optional) Open Learn to add new term definitions if they were created during tagging.

## Open Decisions
- Comments platform: Supabase vs. Giscus vs. proprietary.  
- Search: rely on Sanity GROQ for MVP; upgrade to dedicated search later.  
- Autolink aggressiveness: threshold for term highlighting to avoid overlinking.  
- Whether to store audio enclosure URL from RSS for an inline audio player on episode pages.

## Risks / Mitigations
- **Subtitle JSON variability:** validate schema; fallback to YouTube/VTT import if fields missing.  
- **Overlinking Learn terms:** add max frequency per term per episode and manual review step.  
- **Performance with long transcripts:** render server-side, chunk by sections, lazy-load long lists.  
- **Editor friction:** keep Studio forms minimal; add presets/defaults; keep scripts idempotent.

