import Link from '@components/link';
import React from 'react';
import styles from './footer.module.css';

const PostFooter = () => {
  return (
    <>
      <hr style={{ marginBlock: 50 }} />
      <footer className={styles.footer}>
        <p>
          Obrigado por ler! Se você quer ver mais conteúdos no futuro, considere me seguir{' '}
          <Link external href="https://twitter.com/engineerdesoft">
            no Twitter
          </Link>{' '}
          ou se inscreva no
          <Link href="/feed.xml"> feed RSS</Link>.
        </p>
      </footer>
    </>
  );
};

export default PostFooter;
