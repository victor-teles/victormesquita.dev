'use client';

import { useState } from 'react';

import BlockEntry from '@components/entry/block';
import type { Review } from '@lib/types';
import styles from '../posts-list/posts-list.module.css';

type Props =
  | {
      reviews: Review[];
      paginate?: boolean;
    }
  | {
      skeleton: true;
    };

const ReviewsList = (props: Props) => {
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

  const { reviews, paginate } = props;

  return (
    <ul className={styles.container}>
      {reviews.slice(0, paginate ? showMore : undefined).map((note) => {
        const date = new Date(note.date).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        });

        return (
          <BlockEntry
            // TODO: Math.random is a bad hack.
            key={`review-item-${note.slug || Math.random()}`}
            href={`/reviews/${note.slug}`}
            title={note.title}
            date={new Date(date)}
            description={note.description}
          />
        );
      })}
      {paginate && showMore < reviews.length && (
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

export default ReviewsList;
