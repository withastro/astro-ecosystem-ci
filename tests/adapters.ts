import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'withastro/adapters',
		branch: 'main',
		build: 'build:ci',
		test: 'test:astro-ci',
	});
}
