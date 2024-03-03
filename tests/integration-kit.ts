import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'florian-lefebvre/astro-integration-kit',
		branch: 'main',
		build: 'lint',
		test: 'test',
	});
}
