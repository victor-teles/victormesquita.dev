import Outline from '@components/layout-outline'

export const metadata = {
  title: 'Reviews',
  description: 'Reviews e comentários sobre produtos open-source.',
  alternates: {
    canonical: 'https://victormesquita.dev/reviews',
  },
}

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Outline type="layout" name="Reviews">
      <article>{children}</article>
    </Outline>
  )
}
