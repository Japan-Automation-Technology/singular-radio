import { Studio } from "next-sanity/studio";
import config from "@/../sanity.config";

export const revalidate = 0; // always fresh

export default function StudioPage() {
  return <Studio config={config} />;
}
