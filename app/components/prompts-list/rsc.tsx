import getPrompts from '@lib/get-prompts';
import PromptsList from '.';

export async function PromptsListRSC({ paginate }: { paginate?: boolean }) {
  const prompts = await getPrompts();
  return <PromptsList prompts={prompts} paginate={paginate} />;
}
