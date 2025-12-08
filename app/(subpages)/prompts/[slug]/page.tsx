import getPrompts, { getPrompt } from '@lib/get-prompts';
import { PostBody } from '@mdx/post-body';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getPrompts();
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
  const post = await getPrompt(slug);
  if (!post) return notFound();
  return <PostBody>{post?.body}</PostBody>;
}
