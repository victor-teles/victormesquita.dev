import Outline from '@components/layout-outline'

export const metadata = {
  title: 'Blog',
  description: 'Posts e dicas, principalmente sobre software.',
  alternates: {
    canonical: 'https://victormesquita.dev/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Outline type="layout" name="Blog">
      <article>{children}</article>
    </Outline>
  )
}
