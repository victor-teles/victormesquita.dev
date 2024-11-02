import PostsList from '@components/posts-list';
import styles from './error.module.css';

import { Post } from '@lib/types';

type Props = {
  status: number;
  posts: Promise<Post[]>;
};

const Error = async ({ status, posts: postsPromise }: Props) => {
  const posts = await postsPromise;
  return (
    <>
      {status === 404 ? (
        <section>
          <h1 className={styles.first}>Está talvez seja a página que você está procurando.</h1>
          <h2 className={styles.second}>Talvez alguma dessas 👇?</h2>
          <span className={styles.third}>
            <PostsList paginate={true} posts={posts} />
          </span>
        </section>
      ) : (
        <section className={styles.section}>
          <span>{status || '?'}</span>
          <p>Um erro ocorreu.</p>
        </section>
      )}
    </>
  );
};

export default Error;
