'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './stepper.module.css';

export function Stepper({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`${styles.stepper} ${className || ''}`}>{children}</div>;
}

export function Step({ children, title }: { children: React.ReactNode, title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px' // Trigger slightly before it's fully in view
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.step} ${isVisible ? styles.visible : ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
