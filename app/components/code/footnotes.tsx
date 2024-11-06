import { AnnotationHandler, InnerLine } from 'codehike/code';
import styles from './footnotes.module.css';

export const footnotes: AnnotationHandler = {
  name: 'ref',
  AnnotatedLine: ({ annotation, ...props }) => {
    return (
      <div className={styles.footnotes}>
        <InnerLine merge={props} />
        <NumberFootNote n={annotation.data.n} />
      </div>
    );
  },
};

export function NumberFootNote({ n }: { n: number }) {
  return <span data-value={n} className={styles.number}/>;
}
