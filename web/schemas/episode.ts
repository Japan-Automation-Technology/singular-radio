import { defineField, defineType } from "sanity";

export const episode = defineType({
  name: "episode",
  title: "Episode",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "guest", type: "string" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "duration", type: "string" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "youtubeUrl", type: "url" }),
    defineField({ name: "spotifyUrl", type: "url" }),
    defineField({ name: "appleUrl", type: "url" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "transcript",
      type: "array",
      of: [{ type: "transcriptSegment" }],
      description: "Imported from timestamped JSON; one item = one segment.",
    }),
    defineField({
      name: "learnRefs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "learnTerm" }] }],
      title: "Learn Terms in this episode",
    }),
    defineField({
      name: "showNotes",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
