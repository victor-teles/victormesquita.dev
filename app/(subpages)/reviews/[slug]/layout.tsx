import getPosts from '@lib/get-posts';
import Navigation from '@components/content-footer/navigation';
import PostFooter from '@components/content-footer/post-footer';
import styles from '../../blog/[slug]/layout.module.css';
import { Metadata } from 'next';
import getReviews from '@lib/get-reviews';
import { JSX } from 'react';
import Image from 'next/image';

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
  const reviews = (await getReviews()).find((p) => p?.slug === slug);
  return {
    title: reviews?.title,
    description: reviews?.description,
    alternates: {
      canonical: `https://victormesquita.dev/reviews/${slug}`,
    },
  };
};

async function getData({ slug }: { slug: string }) {
  const reviews = await getReviews();
  const noteIndex = reviews.findIndex((p) => p?.slug === slug);

  if (noteIndex === -1) {
    throw new Error(`${slug} not found in notes. Did you forget to rename the file?`);
  }

  const note = reviews[noteIndex];

  return {
    previous: reviews[noteIndex + 1] || null,
    next: reviews[noteIndex - 1] || null,
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
