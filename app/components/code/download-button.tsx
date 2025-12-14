'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';
import styles from './copy-button.module.css';

export function DownloadButton({ text, fileName }: { text: string; fileName?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.copyButtonWrapper}>
      <button
        className={styles.copyButton}
        aria-label="Download file"
        onClick={handleDownload}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        type="button"
      >
        <Download size={18} />
      </button>
      {showTooltip && <span className={styles.tooltip}>Download file</span>}
    </div>
  );
}
