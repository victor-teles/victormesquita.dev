'use client';

import { useState } from 'react';

import BlockEntry from '@components/entry/block';
import type { Prompts } from '@lib/types';
import styles from '../posts-list/posts-list.module.css';

type Props =
  | {
      prompts: Prompts[];
      paginate?: boolean;
    }
  | {
      skeleton: true;
    };

const PromptsList = (props: Props) => {
  const [showMore, setShowMore] = useState(4);

  if ('skeleton' in props) {
    return (
      <ul className={styles.container}>
        {[...Array(4)].map((_, i) => (
          <BlockEntry key={i} skeleton />
        ))}
      </ul>
    );
  }

  const { prompts, paginate } = props;

  return (
    <ul className={styles.container}>
      {prompts.slice(0, paginate ? showMore : undefined).map((prompt) => {
        const date = new Date(prompt.date).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <BlockEntry
            // TODO: Math.random is a bad hack.
            key={`prompt-item-${prompt.slug || Math.random()}`}
            href={`/prompts/${prompt.slug}`}
            title={prompt.title}
            date={new Date(date)}
            description={prompt.description}
          />
        );
      })}
      {paginate && showMore < prompts.length && (
        <button
          onClick={() => {
            setShowMore(showMore + 4);
          }}
          className={styles.button}
          type="button"
        >
          Show More
        </button>
      )}
    </ul>
  );
};

export default PromptsList;