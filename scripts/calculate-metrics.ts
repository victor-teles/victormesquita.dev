import fs from 'node:fs';
import path from 'node:path';
import { globby } from 'globby';
import { createTokenlens, computeCostUSD, getContextLimits } from 'tokenlens';

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');

// Map display names to real model IDs for calculation
const MODELS = {
  'Gemini 3 Pro': 'google/gemini-3-pro',
  'GPT 5.2': 'openai/gpt-5.2-pro',
  'Opus 4.5': 'anthropic/claude-opus-4.5',
};

async function calculateMetrics() {
  const mdxFiles = await globby(path.join(PROMPTS_DIR, '*.mdx'));
  const tl = createTokenlens();

  

  for (const filePath of mdxFiles) {
    console.log(`Processing ${path.basename(filePath)}...`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find PromptFile src
    const promptFileMatch = content.match(/<PromptFile\s+src="([^"]+)"\s*\/>/);
    if (!promptFileMatch) {
      console.warn(`No PromptFile found in ${filePath}`);
      continue;
    }

    const promptRelativePath = promptFileMatch[1];
    const promptAbsolutePath = path.join(process.cwd(), promptRelativePath);

    if (!fs.existsSync(promptAbsolutePath)) {
      console.error(`Prompt file not found: ${promptAbsolutePath}`);
      continue;
    }

    const promptContent = fs.readFileSync(promptAbsolutePath, 'utf8');
    
    try {
      const metricsData: Record<string, any> = {};

      for (const [displayName, modelId] of Object.entries(MODELS)) {
        const inputTokens = (await tl.countTokens({ modelId, data: promptContent })) ?? 0;
        const outputTokens = Math.round(inputTokens * 2.5); 
        const totalTokens = inputTokens + outputTokens;
        
        const cost = await computeCostUSD({
            modelId,
            usage: { input_tokens: inputTokens, output_tokens: outputTokens }
        });

        let limit = 128000;
        try {
             const limits = await getContextLimits({ modelId });
             if (limits?.input) {
                 limit = limits?.input;
             }
        } catch (e) {
            console.warn(`Could not get limits for ${modelId}`, e);
        }

        metricsData[displayName] = {
            tokenConsumption: {
                input: inputTokens,
                output: outputTokens,
                total: totalTokens,
                limit: limit
            },
            cost: {
                average: cost,
                total: cost.inputTokenCostUSD * 1000, // Estimate total project cost (1000 runs)
                currency: 'USD'
            }
        };
      }

      // Update PromptMetrics
      const metricsRegex = /<PromptMetrics[\s\S]*?\/>/;
      const metricsMatch = content.match(metricsRegex);

      if (metricsMatch) {
        let metricsTag = metricsMatch[0];
        
        // Remove old props
        metricsTag = metricsTag.replace(/tokenConsumption=\{\{[^}]+\}\}/, '');
        metricsTag = metricsTag.replace(/cost=\{\{[^}]+\}\}/, '');
        metricsTag = metricsTag.replace(/successRate=\{\{[^}]+\}\}/, '');
        
        // Clean up extra newlines/spaces
        metricsTag = metricsTag.replace(/\s+/, ' '); 
        
        const modelsProp = `models={${JSON.stringify(metricsData, null, 2)}}`;

        // Add new models prop
        if (metricsTag.includes('models={')) {
            metricsTag = metricsTag.replace(/models=\{[^}]+\}/, modelsProp);
        } else {
            // Insert before />
            metricsTag = metricsTag.replace(/\s*\/>/, `\n  ${modelsProp}\n/>`);
        }
        
        content = content.replace(metricsRegex, metricsTag);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${path.basename(filePath)} with multi-model metrics`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }
}

calculateMetrics().catch(console.error);
