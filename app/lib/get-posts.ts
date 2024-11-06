import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import type { Post } from './types';

const thirdPartyPosts: Post[] = [
  // {
  //   title: 'Introducing AI SDK 3.0 with Generative UI support',
  //   description: 'Stream React Components from LLMs to deliver richer user experiences.',
  //   body: '',
  //   date: '2024-03-01T10:00:00.000Z',
  //   slug: '',
  //   tags: [],
  //   lastModified: 0,
  //   isThirdParty: true,
  //   href: 'https://vercel.com/blog/ai-sdk-3-generative-ui',
  //   type: 'post',
  // },
];

export const getPosts = cache(async (includeThirdPartyPosts?: boolean) => {
  const posts = await fs.readdir('./posts/');

  const postsWithMetadata = await Promise.all(
    posts
      .filter((file) => path.extname(file) === '.md' || path.extname(file) === '.mdx')
      .map(async (file) => {
        const filePath = `./posts/${file}`;
        const postContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(postContent);

        if (data.published === false) {
          return null;
        }

        return { ...data, body: content, type: 'post' } as Post;
      }),
  );

  const postsWithMetadataAndThirdPartyPosts = [
    ...postsWithMetadata,
    ...(includeThirdPartyPosts ? thirdPartyPosts : []),
  ];

  const filtered = postsWithMetadataAndThirdPartyPosts
    .filter((post) => post !== null)
    .sort((a, b) => (a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0)) as Post[];

  return filtered;
});

export async function getPost(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export default getPosts;
