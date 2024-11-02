"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import styles from './copy-button.module.css'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className={styles.copyButton}
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      type="button"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}
