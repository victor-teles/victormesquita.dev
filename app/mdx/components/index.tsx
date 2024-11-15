import { Code } from '@components/code';
import { InlineCode } from '@components/code/inline-code';
import DrizzleBenchmark from '@components/drizzle-benchmark/MdxBenchmark';
import { File, FileTree, Folder } from '@components/file-tree';
import Home from '@components/icons/home';
import Info from '@components/icons/info';
import { MDXComponents } from 'mdx/types';
import NextImage from 'next/image';
import { Tweet } from 'react-tweet';
import { MDXImage } from './mdx-image';
import { MDXNote } from './mdx-note';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@components/table';

export const mdxComponents: MDXComponents = {
  Code,
  InlineCode,
  img: MDXImage as any,
  Image: NextImage as any,
  DrizzleBenchmark,
  Details: ({
    children,
    summary,
    ...props
  }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLDetailsElement> & {
    summary: string;
  }) => (
    // Necessary due to a hydration error I can't quite figure out
    <details {...props}>
      {summary && <summary>{summary}</summary>}
      {children}
    </details>
  ),
  Note: MDXNote,
  //   icons
  InfoIcon: Info,
  HomeIcon: Home,
  // file tree
  FileTree: FileTree as any,
  File: File as any,
  Folder: Folder as any,

  Tweet: (props) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Tweet {...props} />
    </div>
  ),
  table: (props) => <Table {...props} />,
  thead: (props) => <TableHeader {...props} />,
  tbody: (props) => <TableBody {...props} />,
  tfoot: (props) => <TableFooter {...props} />,
  th: (props) => <TableHead {...props} />,
  tr: (props) => <TableRow {...props} />,
  td: (props) => <TableCell {...props} />,
  caption: (props) => <TableCaption {...props} />,
};
