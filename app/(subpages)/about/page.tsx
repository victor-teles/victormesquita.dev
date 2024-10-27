import Link from '@components/link'

export const metadata = {
  title: 'About',
  description: 'About this website.',
  alternates: {
    canonical: 'https://victormesquita.dev/about',
  },
}

const About = () => {
  return (
    <article>
      <p>
        This site is built {' '} by Max Leiter and modified by me {' '} with {' '}
        <Link external href="https://nextjs.com">
          Next.js 13
        </Link>{' '}
        App Directory and is deployed via{' '}
        <Link external href="https://vercel.com/home">
          Vercel
        </Link>
        . The icons are from{' '}
        <Link external href="https://lucide.dev/icons/">
          Lucid Icons
        </Link>
        . You can view the source on{' '}
        <Link external href="https://github.com/victor-teles/victormesquita.dev">
          GitHub
        </Link>
        .
      </p>
    </article>
  )
}

export default About
