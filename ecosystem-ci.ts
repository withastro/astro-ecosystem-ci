import fs from 'fs';
import path from 'path';
import { cac } from 'cac';
import process from 'process';

import type { CommandOptions, RunOptions } from './types.d.ts';
import {
	buildAstro,
	setupAstroRepo,
	setupEnvironment,
	// bisectVite,
	// parseViteMajor,
	// parseMajorVersion,
} from './utils.ts';

const cli = cac();
cli
	.command('[...suites]', 'build astro and run selected suites')
	.option('--verify', 'verify checkouts by running tests', { default: false })
	.option('--repo <repo>', 'astro repository to use', { default: 'withastro/astro' })
	.option('--branch <branch>', 'astro branch to use', { default: 'main' })
	.option('--tag <tag>', 'astro tag to use')
	.option('--commit <commit>', 'astro commit sha to use')
	.option('--release <version>', 'astro release to use from npm registry')
	.action(async (suites, options: CommandOptions) => {
		const { root, astroPath, workspace } = await setupEnvironment();
		const suitesToRun = getSuitesToRun(suites, root);
		// let viteMajor
		if (!options.release) {
			await setupAstroRepo(options);
			await buildAstro({ verify: options.verify });
			// viteMajor = parseViteMajor(vitePath)
		} else {
			// viteMajor = parseMajorVersion(options.release)
		}
		const runOptions: RunOptions = {
			root,
			astroPath,
			// viteMajor,
			workspace,
			release: options.release,
			verify: options.verify,
			skipGit: false,
		};
		for (const suite of suitesToRun) {
			await run(suite, runOptions);
		}
	});

cli
	.command('build-vite', 'build astro only')
	.option('--verify', 'verify astro checkout by running tests', {
		default: false,
	})
	.option('--repo <repo>', 'astro repository to use', { default: 'withastro/astro' })
	.option('--branch <branch>', 'astro branch to use', { default: 'main' })
	.option('--tag <tag>', 'astro tag to use')
	.option('--commit <commit>', 'astro commit sha to use')
	.action(async (options: CommandOptions) => {
		await setupEnvironment();
		await setupAstroRepo(options);
		await buildAstro({ verify: options.verify });
	});

cli
	.command('run-suites [...suites]', 'run single suite with pre-built astro')
	.option('--verify', 'verify checkout by running tests before using local astro', {
		default: false,
	})
	.option('--repo <repo>', 'astro repository to use', { default: 'withastro/astro' })
	.option('--release <version>', 'astro release to use from npm registry')
	.action(async (suites, options: CommandOptions) => {
		const { root, astroPath, workspace } = await setupEnvironment();
		const suitesToRun = getSuitesToRun(suites, root);
		const runOptions: RunOptions = {
			...options,
			root,
			astroPath,
			// viteMajor: parseViteMajor(vitePath),
			workspace,
		};
		for (const suite of suitesToRun) {
			await run(suite, runOptions);
		}
	});

cli
	.command('bisect [...suites]', 'use git bisect to find a commit in astro that broke suites')
	.option('--good <ref>', 'last known good ref, e.g. a previous tag. REQUIRED!')
	.option('--verify', 'verify checkouts by running tests', { default: false })
	.option('--repo <repo>', 'astro repository to use', { default: 'withastro/astro' })
	.option('--branch <branch>', 'astro branch to use', { default: 'main' })
	.option('--tag <tag>', 'astro tag to use')
	.option('--commit <commit>', 'astro commit sha to use')
	.action(async (suites, options: CommandOptions & { good: string }) => {
		if (!options.good) {
			console.log('you have to specify a known good version with `--good <commit|tag>`');
			process.exit(1);
		}
		const { root, astroPath, workspace } = await setupEnvironment();
		const suitesToRun = getSuitesToRun(suites, root);
		let isFirstRun = true;
		const { verify } = options;
		const runSuite = async () => {
			try {
				await buildAstro({ verify: isFirstRun && verify });
				for (const suite of suitesToRun) {
					await run(suite, {
						verify: !!(isFirstRun && verify),
						skipGit: !isFirstRun,
						root,
						astroPath,
						// viteMajor: parseViteMajor(vitePath),
						workspace,
					});
				}
				isFirstRun = false;
				return null;
			} catch (e) {
				return e;
			}
		};
		await setupAstroRepo({ ...options, shallow: false });
		await runSuite();
		// const initialError = await runSuite()
		// if (initialError) {
		// 	await bisectVite(options.good, runSuite)
		// } else {
		// 	console.log(`no errors for starting commit, cannot bisect`)
		// }
	});
cli.help();
cli.parse();

async function run(suite: string, options: RunOptions) {
	const { test } = await import(`./tests/${suite}.ts`);
	await test({
		...options,
		workspace: path.resolve(options.workspace, suite),
	});
}

function getSuitesToRun(suites: string[], root: string) {
	let suitesToRun: string[] = suites;
	const availableSuites: string[] = fs
		.readdirSync(path.join(root, 'tests'))
		.filter((f: string) => !f.startsWith('_') && f.endsWith('.ts'))
		.map((f: string) => f.slice(0, -3));
	availableSuites.sort();
	if (suitesToRun.length === 0) {
		suitesToRun = availableSuites;
	} else {
		const invalidSuites = suitesToRun.filter(
			(x) => !x.startsWith('_') && !availableSuites.includes(x)
		);
		if (invalidSuites.length) {
			console.log(`invalid suite(s): ${invalidSuites.join(', ')}`);
			console.log(`available suites: ${availableSuites.join(', ')}`);
			process.exit(1);
		}
	}
	return suitesToRun;
}
