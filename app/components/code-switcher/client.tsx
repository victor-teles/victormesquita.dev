"use client"

import { useState } from "react"
import { Pre, HighlightedCode } from "codehike/code"
import { mark } from "../code/mark"
import { diff } from "../code/diff"
import { footnotes, NumberFootNote } from "../code/footnotes"
import { callout } from "../code/callout"
import { tokenTransitions } from "../code/token-transitions"
import { CopyButton } from "../code/copy-button"
import styles from "../code/code.module.css"
import switcherStyles from "./switcher.module.css"
import { Switch } from "../switch"

export function ClientCodeSwitcher({
  prismaHighlighted,
  drizzleHighlighted,
  type = "tabs",
}: {
  prismaHighlighted: HighlightedCode
  drizzleHighlighted: HighlightedCode
  type?: "tabs" | "switch"
}) {
  const [active, setActive] = useState<"prisma" | "drizzle">("prisma")
  const highlighted = active === "prisma" ? prismaHighlighted : drizzleHighlighted

  const noteAnnotations = highlighted.annotations.filter(
    ({ name }) => name === "ref",
  )
  const notes = noteAnnotations.map(({ query }) => query)

  noteAnnotations.forEach((a, index) => {
    a.data = { n: index + 1 }
  })

  return (
    <div className={styles.frame}>
      <div className={switcherStyles.header}>
        {type === "tabs" ? (
          <div className={switcherStyles.tabs}>
            <button
              type="button"
              onClick={() => setActive("prisma")}
              className={
                active === "prisma"
                  ? switcherStyles.activeTab
                  : switcherStyles.tab
              }
            >
              Prisma
            </button>
            <button
              type="button"
              onClick={() => setActive("drizzle")}
              className={
                active === "drizzle"
                  ? switcherStyles.activeTab
                  : switcherStyles.tab
              }
            >
              Drizzle
            </button>
          </div>
        ) : (
          <div className={switcherStyles.switchContainer}>
            <button
              type="button"
              className={
                active === "prisma"
                  ? switcherStyles.activeLabel
                  : switcherStyles.label
              }
              onClick={() => setActive("prisma")}
            >
              Prisma
            </button>
            <Switch
              checked={active === "drizzle"}
              onCheckedChange={(checked) =>
                setActive(checked ? "drizzle" : "prisma")
              }
            />
            <button
              type="button"
              className={
                active === "drizzle"
                  ? switcherStyles.activeLabel
                  : switcherStyles.label
              }
              onClick={() => setActive("drizzle")}
            >
              Drizzle
            </button>
          </div>
        )}
        {highlighted.meta && (
          <div className={styles.title}>{highlighted.meta}</div>
        )}
      </div>

      <CopyButton text={highlighted.code} />
      <Pre
        code={highlighted}
        handlers={[mark, diff, footnotes, callout, tokenTransitions]}
      />

      <ul style={{ marginTop: "1rem", listStyleType: "none" }}>
        {notes.map((ref, index) => (
          <li
            key={index}
            style={{ fontSize: ".875rem", lineHeight: "1.25rem" }}
          >
            <NumberFootNote n={index + 1} />
            <span style={{ paddingLeft: ".25rem" }}>{ref}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
