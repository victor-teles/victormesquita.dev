import { cache } from 'react';
import { readFiles } from './read-files';
import { Prompts } from './types';

export const getPrompts = cache(async () => {
  const promptsWithMetadata = readFiles<Prompts>('./prompts/');

  const filtered = promptsWithMetadata
    .filter((prompt) => prompt !== null)
    .sort((a, b) => (a && b ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0))
    .map((prompt) => {
      return {
        ...prompt,
        type: 'prompts',
      };
    });

  return filtered as Prompts[];
});

export async function getPrompt(slug: string) {
  const prompts = await getPrompts();
  return prompts.find((prompt) => prompt.slug === slug);
}

export default getPrompts;