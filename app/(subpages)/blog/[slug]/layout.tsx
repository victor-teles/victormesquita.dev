import getPosts from '@lib/get-posts'
import Navigation from '@components/content-footer/navigation'
import PostFooter from '@components/content-footer/post-footer'
import styles from './layout.module.css'
import { Metadata } from 'next'
import { JSX } from 'react'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> => {
  const { slug } = await params
  const post = (await getPosts()).find((p) => p?.slug === slug)
  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: `https://victormesquita.dev/blog/${slug}`,
    },
  }
}

async function getData({ slug }: { slug: string }) {
  const posts = await getPosts()
  const postIndex = posts.findIndex((p) => p?.slug === slug)

  if (postIndex === -1) {
    throw new Error(`${slug} not found in posts. Did you forget to rename the file?`)
  }

  const post = posts[postIndex]

  const { ...rest } = post

  return {
    previous: posts[postIndex + 1] || null,
    next: posts[postIndex - 1] || null,
    ...rest,
  }
}

export default async function PostLayout({
  children,
  params,
}: {
  children: JSX.Element
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await params
  const { previous, next, title, date, lastModified } = await getData({ slug })

  const lastModifiedDate = lastModified
    ? new Date(lastModified).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : null

  return (
    <>
      <div className={styles.wrapper}>
        <span className={styles.date}>{date}</span>
        {lastModified ? (
          <span className={styles.lastModified}>
            Last modified {lastModifiedDate}
          </span>
        ) : null}
        {/* {updatedViews && <FadeIn>{updatedViews} views</FadeIn>} */}
      </div>
      <article>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </article>
      <PostFooter />
      <Navigation previous={previous} next={next} />
    </>
  )
}
