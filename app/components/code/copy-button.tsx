'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import styles from './copy-button.module.css';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.copyButtonWrapper}>
      <button
        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        type="button"
        disabled={copied}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
      {showTooltip && !copied && (
        <span className={styles.tooltip}>Copy code</span>
      )}
      {copied && <span className={styles.tooltip}>Copied!</span>}
    </div>
  );
}
