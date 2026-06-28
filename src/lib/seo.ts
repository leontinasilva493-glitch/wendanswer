import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  absoluteTitle?: boolean;
  imageTitle?: string;
  imageSubtitle?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: Metadata["robots"];
};

export const noindexFollow = {
  index: false,
  follow: true,
} satisfies Metadata["robots"];

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords,
  absoluteTitle,
  imageTitle,
  imageSubtitle,
  publishedTime,
  modifiedTime,
  robots,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const imageParams = new URLSearchParams({
    title: imageTitle ?? title,
    subtitle: imageSubtitle ?? description,
  });
  const imageUrl = absoluteUrl(`/api/og?${imageParams.toString()}`);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    robots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${site.name}`,
        },
      ],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function breadcrumbJson(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJson(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
  };
}

export function faqJson(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToJson(input: {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
