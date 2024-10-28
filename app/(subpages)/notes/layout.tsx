import Outline from '@components/layout-outline'

export const metadata = {
  title: 'Dev Notes',
  description: 'Snippets, aprendizados e pensamentos curtos.',
  alternates: {
    canonical: 'https://victormesquita.dev/notes',
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
