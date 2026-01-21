import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import schemas from "./schemas";
import { subtitleImportPlugin } from "./plugins/subtitle-import";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "singular-radio",
  title: "Singular Radio Studio",
  projectId,
  dataset,
  plugins: [deskTool(), visionTool(), subtitleImportPlugin()],
  schema: {
    types: schemas,
  },
});
