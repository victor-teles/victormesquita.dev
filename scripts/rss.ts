import fs from 'node:fs'
import RSS from 'rss'
import path from 'node:path'
import { marked } from 'marked'
import matter from 'gray-matter'
import { Note, Post } from '@lib/types'

const posts = fs
  .readdirSync(path.resolve(__dirname, '../posts'))
  .filter(
    (file) => path.extname(file) === '.md' || path.extname(file) === '.mdx',
  )
  .map((file) => {
    const markdown = fs.readFileSync(
      path.resolve(__dirname, '../posts', file),
      'utf-8',
    )
    const { data, content }: { data: any; content: string } = matter(markdown)
    return { ...data, body: content }
  })
const notes = fs
  .readdirSync(path.resolve(__dirname, '../notes'))
  .filter(
    (file) => path.extname(file) === '.md' || path.extname(file) === '.mdx',
  )
  .map((file) => {
    const markdown = fs.readFileSync(
      path.resolve(__dirname, '../notes', file),
      'utf-8',
    )
    const { data, content }: { data: any; content: string } = matter(markdown)
    return { ...data, body: content }
  })

const combined: (Note | Post)[] = [...posts, ...notes].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

const renderer = new marked.Renderer()

renderer.link = (href, _, text) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
})

const renderPost = (md: string) =>
  marked.parse(md, {
    async: false,
  }) as string

const main = () => {
  const feed = new RSS({
    title: 'Victor Mesquita',
    site_url: 'https://victormesquita.dev',
    feed_url: 'https://victormesquita.dev/feed.xml',
    // image_url: 'https://victormesquita.dev/og.png',
    language: 'en',
    description: "Victor Mesquita's blog",
  })

  combined.forEach((post) => {
    const url = `https://victormesquita.dev/${post.type === 'post' ? 'blog' : 'notes'}/${post.slug}`
    feed.item({
      title: post.title,
      description: renderPost(post.body),
      date: new Date(post?.date),
      author: 'Victor Mesquita',
      url,
      categories: [post.type],
      guid: url,
    })
  })

  const rss = feed.xml({ indent: true })
  fs.writeFileSync(path.join(__dirname, '../public/feed.xml'), rss)
}

main()
