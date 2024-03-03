import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'expressive-code/expressive-code',
		overrides: {
			'@astrojs/mdx': true,
		},
		branch: 'main',
		build: 'build',
		test: 'test',
	});
}
