import { Code } from '@components/code';
import fs from 'node:fs';
import path from 'node:path';

export async function PromptFile({ src, name }: { src: string; name?: string }) {
  const filePath = path.join(process.cwd(), src);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // If name is not provided, extract it from the src path
  const fileName = name || path.basename(src);
  
  return <Code codeblock={{ value: content, lang: 'markdown', meta: fileName }} />;
}
