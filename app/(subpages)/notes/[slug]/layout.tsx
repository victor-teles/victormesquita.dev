import Navigation from '@components/content-footer/navigation';
import PostFooter from '@components/content-footer/post-footer';
import getNotes from '@lib/get-notes';
import getPosts from '@lib/get-posts';
import { Metadata } from 'next';
import Image from 'next/image';
import { JSX } from 'react';
import styles from '../../blog/[slug]/layout.module.css';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const note = (await getNotes()).find((p) => p?.slug === slug);
  return {
    title: note?.title,
    description: note?.description,
    alternates: {
      canonical: `https://victormesquita.dev/notes/${slug}`,
    },
    openGraph: {
      title: note?.title,
      description: note?.description,
      url: `https://victormesquita.dev/notes/${slug}`,
      siteName: 'Victor Mesquita',
      type: 'article',
      publishedTime: note?.date,
      authors: ['Victor Mesquita'],
    },
    twitter: {
      card: 'summary_large_image',
      title: note?.title,
      description: note?.description,
      creator: '@engineerdesoft',
    },
  };
};

async function getData({ slug }: { slug: string }) {
  const notes = await getNotes();
  const noteIndex = notes.findIndex((p) => p?.slug === slug);

  if (noteIndex === -1) {
    throw new Error(`${slug} not found in notes. Did you forget to rename the file?`);
  }

  const note = notes[noteIndex];

  return {
    previous: notes[noteIndex + 1] || null,
    next: notes[noteIndex - 1] || null,
    ...note,
  };
}

export default async function PostLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const { previous, next, title, date, description } = await getData({ slug });

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.date}>{date}</span>
      </div>
      <article className="prose prose-slate">
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{description}</p>

        <div className={styles.avatar}>
          <Image src="/imgs/profile.jpeg" alt="Esse sou eu" width={30} height={30} className={styles.img} />
          <span>
            <span className={styles.writtenBy}>Escrito por</span> Victor Mesquita
          </span>
        </div>

        {children}
      </article>
      <PostFooter />
      <Navigation previous={previous} next={next} />
    </>
  );
}
