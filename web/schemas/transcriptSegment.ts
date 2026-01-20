import { defineField, defineType } from "sanity";

export const transcriptSegment = defineType({
  name: "transcriptSegment",
  title: "Transcript Segment",
  type: "object",
  fields: [
    defineField({
      name: "segmentId",
      title: "Segment ID",
      type: "string",
      description: "Keep stable if re-importing",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "start",
      title: "Start (seconds)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "end",
      title: "End (seconds)",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
  ],
});
