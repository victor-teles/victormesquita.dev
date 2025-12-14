import { MDXRemote } from 'next-mdx-remote/rsc';

// @ts-expect-error no types
import remarkA11yEmoji from '@fec/remark-a11y-emoji';
import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import { mdxComponents } from './components';

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
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
          recmaPlugins: [[recmaCodeHike, chConfig]]
        },
      }}
      components={mdxComponents}
    />
  );
}
