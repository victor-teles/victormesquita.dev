import {  Pre, RawCode, highlight } from 'codehike/code';
import styles from './code.module.css';
import { CopyButton } from './copy-button';
import { DownloadButton } from './download-button';
import { diff } from './diff';
import { mark } from './mark';
import { footnotes, NumberFootNote } from './footnotes';
import { callout } from './callout';
import { tokenTransitions } from './token-transitions';

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
      {highlighted.meta&&<div className={styles.title}>{highlighted.meta}</div>}
      <div className={styles.buttonsContainer}>
        <DownloadButton text={highlighted.code} fileName={highlighted.meta || 'code.txt'} />
        <CopyButton text={highlighted.code} />
      </div>
      <Pre code={highlighted} handlers={[mark, diff, footnotes, callout, tokenTransitions]} />

      <ul style={{ marginTop: '1rem', listStyleType: 'none' }}>
        {notes.map((ref, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fuckit
          <li key={index} style={{ fontSize: '.875rem', lineHeight: '1.25rem' }}>
            <NumberFootNote n={index + 1} />
            <span style={{ paddingLeft: '.25rem'}}>{ref}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
