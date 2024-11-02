import Link from '@components/link';

export const metadata = {
  title: 'Sobre',
  description: 'Sobre esse site.',
  alternates: {
    canonical: 'https://victormesquita.dev/about',
  },
};

const About = () => {
  return (
    <article>
      <p>
        Este site foi feito pelo Max Leiter e modificado por mim usando{' '}
        <Link external href="https://nextjs.com">
          Next.js 15
        </Link>{' '}
        e é hospedado via{' '}
        <Link external href="https://vercel.com/home">
          Vercel
        </Link>
        . Os ícones são da{' '}
        <Link external href="https://lucide.dev/icons/">
          Lucid Icons
        </Link>
        . E você pode ver o código fonte em{' '}
        <Link external href="https://github.com/victor-teles/victormesquita.dev">
          GitHub
        </Link>
        .
      </p>
    </article>
  );
};

export default About;
