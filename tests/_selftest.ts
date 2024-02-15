import fs from 'fs';
import path from 'path';
import type { RunOptions } from '../types.d.ts';
import { runInRepo } from '../utils.ts';

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: 'withastro/astro-ecosystem-ci',
		build: async () => {
			const dir = path.resolve(options.workspace, 'astro-ecosystem-ci');
			const pkgFile = path.join(dir, 'package.json');
			const pkg = JSON.parse(await fs.promises.readFile(pkgFile, 'utf-8'));
			if (pkg.name !== 'astro-ecosystem-ci') {
				throw new Error(
					`invalid checkout, expected package.json with "name":"astro-ecosystem-ci" in ${dir}`
				);
			}
			pkg.scripts.selftestscript =
				"[ -d ../../astro/packages/astro/dist ] || (echo 'astro build failed' && exit 1)";
			await fs.promises.writeFile(pkgFile, JSON.stringify(pkg, null, 2), 'utf-8');
		},
		test: 'pnpm run selftestscript',
		verify: false,
	});
}
