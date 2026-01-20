import { groq } from "next-sanity";

export const episodesQuery = groq`
*[_type == "episode"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  guest,
  publishedAt,
  duration,
  summary,
  youtubeUrl,
  spotifyUrl,
  appleUrl,
  tags,
  learnRefs[]->{"slug": slug.current, title},
  transcript[]{
    segmentId,
    text,
    start,
    end
  }
}
`;

export const episodeBySlugQuery = groq`
*[_type == "episode" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  guest,
  publishedAt,
  duration,
  summary,
  youtubeUrl,
  spotifyUrl,
  appleUrl,
  tags,
  learnRefs[]->{"slug": slug.current, title},
  transcript[]{
    segmentId,
    text,
    start,
    end
  }
}
`;

export const learnTermsQuery = groq`
*[_type == "learnTerm"]{
  _id,
  title,
  "slug": slug.current,
  shortDef,
  longDef,
  categories,
  related[]->{"slug": slug.current, title},
  occurrences[]{
    timestamp,
    episode->{ "slug": slug.current, title, publishedAt }
  }
}
`;

export const learnTermBySlugQuery = groq`
*[_type == "learnTerm" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  shortDef,
  longDef,
  categories,
  related[]->{"slug": slug.current, title},
  occurrences[]{
    timestamp,
    episode->{ "slug": slug.current, title, publishedAt }
  }
}
`;
