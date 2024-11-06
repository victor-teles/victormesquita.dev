import AboutMe from '@components/aboutme';
import { ContentListRSC } from '@components/content-list';
import Link from '@components/link';
import ProjectList from '@components/projects';
import Socials from '@components/socials';
import { getProjects } from '@lib/projects';
import TimeOfDay from '../../timer';
import styles from './page.module.css';

const PROJECT_COUNT = 3;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <AboutMe />
      <Socials />

      <h2 style={{ padding: 'var(--gap-quarter) 0' }}> Artigos</h2>
      <ContentListRSC />

      <h2 style={{ padding: 'var(--gap-quarter) 0' }}>Meus projetos ✨</h2>
      <ProjectList showYears={false} projects={projects.slice(0, PROJECT_COUNT)} seeMore={true} />

      <footer className={styles.footer}>
        <span>
          <Link href="/about">Sobre este site</Link>
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ? (
            <span className={styles.gitSha}>
              <Link
                external
                href={`https://github.com/victor-teles/victormesquita.dev/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
              >
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.slice(0, 7)}
              </Link>
            </span>
          ) : (
            <span className={styles.gitSha}>some git SHA</span>
          )}
        </span>
        <TimeOfDay />
      </footer>
    </>
  );
}
