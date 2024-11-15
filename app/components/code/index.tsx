import {  Pre, RawCode, highlight } from 'codehike/code';
import styles from './code.module.css';
import { CopyButton } from './copy-button';
import { diff } from './diff';
import { mark } from './mark';
import { footnotes, NumberFootNote } from './footnotes';
import { callout } from './callout';

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-from-css");
  const noteAnnotations = highlighted.annotations.filter(
    ({ name }) => name === "ref",
  )
  const notes = noteAnnotations.map(({ query }) => query)

  noteAnnotations.forEach((a, index) => {
    a.data = { n: index + 1 }
  })

  return (
    <div className={styles.frame}>
      <div className={styles.title}>{highlighted.meta}</div>
      <CopyButton text={highlighted.code} />
      <Pre code={highlighted} handlers={[mark, diff, footnotes, callout]} />

      <ul style={{ marginTop: '1rem', listStyleType: 'none' }}>
        {notes.map((ref, index) => (
          <li key={index} style={{ fontSize: '.875rem', lineHeight: '1.25rem' }}>
            <NumberFootNote n={index + 1} />
            <span style={{ paddingLeft: '.25rem'}}>{ref}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
