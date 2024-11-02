import getReviews, { getReview } from '@lib/get-reviews';
import { PostBody } from '@mdx/post-body';
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
  return <PostBody>{post?.body}</PostBody>;
}
