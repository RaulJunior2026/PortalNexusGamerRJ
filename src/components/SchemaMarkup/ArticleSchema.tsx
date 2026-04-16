import React from 'react';

interface ArticleSchemaProps {
  title: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
}

export default function ArticleSchema({
  title,
  url,
  imageUrl,
  publishedAt,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "url": url,
    "image": imageUrl ? [imageUrl] : [],
    "datePublished": publishedAt,
    "author": [{
        "@type": "Organization",
        "name": "Nexus Gamer AI",
        "url": "https://nexus-gamer.example.com"
      }]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
