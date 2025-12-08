import Link from '@components/link';
import { Note, Post, Prompts } from '@lib/types';

import styles from './navigation.module.css';

const Navigation = ({ previous, next }: { previous?: Note | Post | Prompts; next?: Note | Post | Prompts }) => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.previous}>
        {previous && (
          <Link href={`./${previous.slug}`}>
            <div className={styles.title}>← Older</div>
            {previous.title}
          </Link>
        )}
      </div>

      <div className={styles.next}>
        {next && (
          <Link href={`./${next.slug}`}>
            <div className={styles.title}>Newer →</div>
            {next.title}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
