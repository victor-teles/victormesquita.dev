import Outline from '@components/layout-outline';

export const metadata = {
  title: 'Prompts',
  description: 'Prompts e agentes construídos por mim.',
  alternates: {
    canonical: 'https://victormesquita.dev/prompts',
  },
};

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Outline type="layout" name="Prompts">
      <article>{children}</article>
    </Outline>
  );
}
