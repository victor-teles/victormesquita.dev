import Link from '@components/link';
import { Note, Post, Review } from '@lib/types';

import styles from './navigation.module.css';

const Navigation = ({ previous, next }: { previous?: Note | Post | Review; next?: Note | Post | Review }) => {
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
