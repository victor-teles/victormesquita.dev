import { Pre, RawCode, highlight } from 'codehike/code';
import styles from './code.module.css';
import { CopyButton } from './copy-button';
import { diff } from './diff';
import { mark } from './mark';

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, 'github-dark');

  return (
    <div className={styles.frame}>
      <div className={styles.title}>{highlighted.meta}</div>
      <CopyButton text={highlighted.code} />
      <Pre code={highlighted} handlers={[mark, diff]} />
    </div>
  );
}
