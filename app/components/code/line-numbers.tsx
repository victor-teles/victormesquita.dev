import { AnnotationHandler, InnerLine } from 'codehike/code';
import styles from './line-numbers.module.css';

export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className={styles.lineNumbers}>
        <span className={styles.lineNumber} style={{ minWidth: `${width}ch` }}>
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className={styles.innerLine} />
      </div>
    );
  },
};
