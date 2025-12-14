import FilterableList from '@components/filterable-list';
import getNotes from '@lib/get-notes';
import getPosts from '@lib/get-posts';
import getPrompts from '@lib/get-prompts';
import { Suspense } from 'react';
import { getTag, renderItem } from './render-item';

export async function ContentListRSC() {
  const [posts, notes, prompts] = await Promise.all([getPosts(true), getNotes(), getPrompts()]);


  const content = [...posts, ...notes, ...prompts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <Suspense fallback={null}>
        <FilterableList items={content} renderItem={renderItem} tags={getTag} enableSearch={false} enableTags={true} />
      </Suspense>
    </>
  );
}
