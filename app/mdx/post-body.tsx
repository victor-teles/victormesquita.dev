import { MDXRemote } from 'next-mdx-remote/rsc';

import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// @ts-expect-error no types
import remarkA11yEmoji from '@fec/remark-a11y-emoji';
import remarkToc from 'remark-toc';
import { mdxComponents } from './components';
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx';

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  // optional (see code docs):
  components: { code: 'Code' },
};

export function PostBody({ children }: { children: string }) {
  return (
    <MDXRemote
      source={children}
      options={{
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            remarkA11yEmoji,
            [
              remarkToc,
              {
                tight: true,
                maxDepth: 5,
              },
            ],
            [remarkCodeHike, chConfig],
          ],
          rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          recmaPlugins: [[recmaCodeHike, chConfig]],
        },
      }}
      components={mdxComponents}
    />
  );
}
