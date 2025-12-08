'use client';

import BlockEntry from '@components/entry/block';
import { Note, Post, Prompts } from '@lib/types';

export const renderItem = (item: Post | Note | Prompts) => {
  switch (item.type) {
    case 'post':
      return renderPost(item);
    case 'note':
      return renderNote(item);
    case 'prompts':
      return renderPrompts(item);
    default:
      return renderNote(item);
  }
};

export const getTag = (post: Post | Note | Prompts) => {
  switch (post.type) {
    case 'post':
      return ['post'];
    case 'note':
      return ['note'];
    case 'prompts':
      return ['prompts'];
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

function renderPrompts(prompts: Prompts) {
  return (
    <BlockEntry
      key={prompts.slug}
      href={`/prompts/${prompts.slug}`}
      title={prompts.title}
      date={new Date(prompts.date)}
      description={prompts.description}
      type={prompts.type || 'prompts'}
    />
  );
}
