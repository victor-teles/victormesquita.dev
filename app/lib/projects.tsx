import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import type { Project } from './types';

const Projects: Project[] = [
  {
    title: 'Pix.js',
    description: 'Conjunto de ferramentas para integrar trabalhar com PIX',
    href: 'https://pix-js.vercel.app',
    role: 'Creator',
    years: ['2025', 'present'],
    type: 'project',
  },
  {
    title: 'Playwright php',
    description: 'Playwright para PHP',
    href: 'https://github.com/victor-teles/playwright-php',
    role: 'Creator',
    years: ['2025', 'present'],
    type: 'project',
  },
  {
    title: 'PetPode',
    description: 'Saiba o que seu pet pode comer 🐶',
    href: 'https://petpode.food',
    role: 'Creator',
    years: ['2025', 'present'],
    type: 'project',
  },
  {
    title: 'Tipfy',
    description: 'Compartilhe dicas de forma fácil e rápida 💡 - lataforma para influenciadores',
    href: 'https://tipfy.pro/',
    role: 'CTO',
    years: ['2024', 'present'],
    type: 'project',
  },
  {
    title: 'tora-spinner',
    description: 'A thread/worker spinner based on ora/yocto-spinner ✨',
    href: 'https://github.com/quirkie-io/tora',
    role: 'Creator',
    years: ['2024', 'present'],
    type: 'project',
  },
  {
    title: 'Māku',
    description: 'A tinybench based UI to make your benchmarks shine ✨',
    href: 'https://github.com/quirkie-io/maku',
    role: 'Creator',
    years: ['2024', 'present'],
    type: 'project',
  },
];

export const getProjects = cache(async (): Promise<Project[]> => {
  if (process.env.NODE_ENV === 'production' && !process.env.GITHUB_TOKEN) {
    throw new Error('No GITHUB_TOKEN provided. Generate a personal use token on GitHub.');
  }

  const withStars = unstable_cache(
    async () =>
      await Promise.all(
        Projects.map(async (proj) => {
          const split = proj.href?.split('/');
          if (!split) {
            return proj;
          }

          if (split[2] === 'github.com') {
            const user = split[3];
            const repo = split[4];
            const fetchUrl = `https://api.github.com/repos/${user}/${repo}`;
            const { stargazers_count, message } = await (
              await fetch(fetchUrl, {
                headers: {
                  Authorization: process.env.GITHUB_TOKEN ?? '',
                },
                cache: 'force-cache',
              })
            ).json();

            // rate limited
            if (!stargazers_count && message) {
              console.warn(`Rate limited or error: ${message}`);
              return proj;
            }

            return {
              ...proj,
              stars: stargazers_count,
            };
          }
          return proj;
        }),
      ),
    ['projects'],
    {
      revalidate: 60 * 60 * 24, // 24 hours
    },
  );

  return await withStars();
});
