import { defineField, defineType } from "sanity";

export const learnTerm = defineType({
  name: "learnTerm",
  title: "Learn Term",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "shortDef", type: "text", rows: 2 }),
    defineField({ name: "longDef", type: "text" }),
    defineField({ name: "categories", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "related",
      type: "array",
      of: [{ type: "reference", to: [{ type: "learnTerm" }] }],
    }),
    defineField({
      name: "occurrences",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "episode",
              type: "reference",
              to: [{ type: "episode" }],
              validation: (r) => r.required(),
            },
            { name: "timestamp", type: "number", validation: (r) => r.min(0) },
          ],
        },
      ],
    }),
  ],
});
