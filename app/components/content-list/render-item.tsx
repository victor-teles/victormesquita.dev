'use client';

import BlockEntry from '@components/entry/block';
import { Note, Post, Review } from '@lib/types';

export const renderItem = (item: Post | Note | Review) => {
  switch (item.type) {
    case 'post':
      return renderPost(item);
    case 'note':
      return renderNote(item);
    case 'review':
      return renderReview(item);
    default:
      return renderNote(item);
  }
};

export const getTag = (post: Post | Note | Review) => {
  switch (post.type) {
    case 'post':
      return ['post'];
    case 'note':
      return ['note'];
    case 'review':
      return ['review'];
    default:
      return ['note'];
  }
};

function renderPost(post: Post) {
  return (
    <BlockEntry
      key={post.slug || post.href}
      href={post.isThirdParty ? (post.href as string) : `/blog/${post.slug}`}
      title={post.title}
      date={new Date(post.date)}
      description={post.description}
      isThirdParty={post.isThirdParty}
      type={post.type || 'post'}
    />
  );
}

function renderNote(note: Note) {
  return (
    <BlockEntry
      key={note.slug}
      href={`/notes/${note.slug}`}
      title={note.title}
      date={new Date(note.date)}
      description={note.description}
      type={note.type || 'note'}
    />
  );
}

function renderReview(review: Review) {
  return (
    <BlockEntry
      key={review.slug}
      href={`/reviews/${review.slug}`}
      title={review.title}
      date={new Date(review.date)}
      description={review.description}
      type={review.type || 'review'}
    />
  );
}
