import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'florian-lefebvre/astro-integration-kit',
		overrides: {
			'@astrojs/internal-helpers': true,
		},
		branch: 'main',
		build: 'lint',
		test: 'test',
	});
}
