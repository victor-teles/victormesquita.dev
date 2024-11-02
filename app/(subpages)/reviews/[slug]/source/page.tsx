import { TerminalWindow } from '@components/terminal';
import getReviews, { getReview } from '@lib/get-reviews';
import { Code } from 'bright';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getReviews();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const post = await getReview(slug);
  if (!post) return notFound();

  const src = `
---
title: ${post.title}
description: ${post.description || ''}
slug: ${post.slug}
date: ${post.date}
type: ${post.type}
---
${post.body.trim()}
`;

  return (
    <TerminalWindow>
      <Code lang="mdx" style={{ margin: 0, padding: 0 }}>
        {src.trim()}
      </Code>
    </TerminalWindow>
  );
}
