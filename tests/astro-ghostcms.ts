import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'matthiesenxyz/astro-ghostcms',
		overrides: {
			'@astrojs/internal-helpers': true,
			'@astrojs/markdown-remark': true,
			'@astrojs/telemetry': true,
		},
		branch: 'main',
		// build: 'build',
		test: 'test',
	});
}
