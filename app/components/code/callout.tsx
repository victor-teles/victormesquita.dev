import { InlineAnnotation, AnnotationHandler } from "codehike/code"
import styles from "./callout.module.css"

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className={styles.callout}
        >
          <div
            style={{ left: `${column}ch` }}
            className={styles.calloutArrow}
          />
          {annotation.query}
        </div>
      </>
    )
  },
}
