import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'martrapp/astro-vtbot',
		branch: 'main',
		// build: 'format',
		test: 'test',
	});
}
