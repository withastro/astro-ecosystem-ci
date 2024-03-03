import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'florian-lefebvre/astro-integration-kit',
		overrides: {
			'@astrojs/internal-helpers': true,
			'@astrojs/markdown-remark': true,
			'@astrojs/vue': true,
			'@astrojs/tailwind': true,
			'@astrojs/preact': true,
			'@astrojs/react': true,
			'@astrojs/solid-js': true,
			'@astrojs/svelte': true,
			'@astrojs/telemetry': true,
		},
		branch: 'main',
		// build: 'lint',
		test: 'test',
	});
}
