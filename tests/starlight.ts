import type { RunOptions } from "../types.d.ts";
import { runInRepo } from "../utils.ts";

export async function test(options: RunOptions) {
	await runInRepo({
		...options,
		repo: "withastro/starlight",
		overrides: {
			"@astrojs/internal-helpers": true,
			"@astrojs/markdown-remark": true,
			"@astrojs/mdx": true,
			"@astrojs/prism": true,
			"@astrojs/sitemap": true,
			"@astrojs/tailwind": true,
			"@astrojs/telemetry": true,
		},
		branch: "main",
		test: [
			// Check types pass
			"pnpm --filter starlight-docs astro sync",
			"pnpm typecheck",
			// Run tests for core Starlight package
			"pnpm --filter @astrojs/starlight test",
			// Smoke test that building example projects works
			"pnpm build:examples",
		],
	});
}
