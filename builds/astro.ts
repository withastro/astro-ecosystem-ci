import { runInRepo } from '../utils.ts';
import type { RunOptions } from '../types.d.ts';

export async function build(options: RunOptions) {
	return runInRepo({
		...options,
		repo: 'withastro/astro',
		build: 'build',
	});
}

export const packages = {
	'@astrojs/internal-helpers': 'packages/internal-helpers',
	'@astrojs/markdown-remark': 'packages/markdown/remark',
	'@astrojs/telemetry': 'packages/telemetry',
	'@astrojs/mdx': 'packages/integrations/mdx',
};
