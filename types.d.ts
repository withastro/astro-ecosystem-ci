import type { Agent } from "@antfu/ni";
export interface EnvironmentData {
	root: string;
	workspace: string;
	astroPath: string;
	cwd: string;
	env: ProcessEnv;
}

export interface RunOptions {
	workspace: string;
	root: string;
	astroPath: string;
	/**
	 * @default true
	 */
	verify?: boolean;
	/**
	 * Whether to skip cloning and setting up the remote Git repository.
	 * @default false
	 */
	skipGit?: boolean;
	/**
	 * Equivalent to setting a custom value for `astro` in the `overrides` option.
	 * Used by the `--release` CLI flag.
	 */
	release?: string;
	/** The package manager to use to run commands. If not set, tries to detect this automatically. */
	agent?: Agent;
	/** One or more scripts to run in the repository to build/prepare the project. */
	build?: Task | Task[];
	/**
	 * One or more scripts to run in the repository to execute tests.
	 *
	 * These can range from very simple:
	 * ```js
	 * // runs the `test` script defined in `package.json` with the current package manager
	 * test: "test",
	 * ```
	 *
	 * To a more complex series steps:
	 * ```js
	 * test: [
	 *   "node ./setup-script",
	 *   "pnpm --filter package-A test",
	 *   "pnpm --filter package-B type-check",
	 * ],
	 * ```
	 */
	test?: Task | Task[];
	/** One or more scripts to run before installing dependencies. */
	beforeInstall?: Task | Task[];
	/** One or more scripts to run before building the project. */
	beforeBuild?: Task | Task[];
	/** One or more scripts to run before running tests. */
	beforeTest?: Task | Task[];
}

type Task = string | { script: string; args?: string[] } | (() => Promise<any>);

export interface CommandOptions {
	suites?: string[];
	repo?: string;
	branch?: string;
	tag?: string;
	commit?: string;
	release?: string;
	verify?: boolean;
	skipGit?: boolean;
}

export interface RepoOptions {
	/**
	 * A `username/repo` identifier or Git URL for the repository to test. Examples:
	 *
	 * - `"withastro/starlight"`
	 * - `"https://github.com/withastro/starlight.git"`
	 *
	 * The shorthand style is assumed to be hosted on GitHub. The URL could point to other Git hosts.
	 */
	repo: string;
	/**
	 * A subdirectory of the cloned repository to `cd` into before running tests.
	 * @default undefined
	 */
	dir?: string;
	/**
	 * The branch of the repository to test.
	 * @default "main"
	 */
	branch?: string;
	/**
	 * A Git tag to check out for tests. Overrides the `branch` and `commit` options if set.
	 * @default undefined
	 */
	tag?: string;
	/**
	 * A Git commit hash to check out for tests. Overrides the `branch` option if set.
	 * @default undefined
	 */
	commit?: string;
	/**
	 * Whether the repository should be shallow or deep cloned.
	 * @default true
	 */
	shallow?: boolean;
	/**
	 * A map of dependencies to override in the repository being tested.
	 *
	 * `astro` will be overridden by default and you can specify additional `@astrojs/*`
	 * packages to override here. For example:
	 *
	 * ```js
	 * {
	 *   "@astrojs/internal-helpers": true,
	 *   "@astrojs/markdown-remark": true,
	 * }
	 * ```
	 *
	 * An override can also be set to a custom path to the override to use, but usually the
	 * automatic behavior provided by setting `true` is sufficient.
	 */
	overrides?: Overrides;
}

export interface Overrides {
	[key: string]: string | boolean;
}

export interface ProcessEnv {
	[key: string]: string | undefined;
}

interface DependencyInfo {
	from: string;
	version: string;
	resolved: string;
	path: string;
}
interface PackageInfo {
	name: string;
	version: string;
	path: string;
	private: boolean;
	dependencies: Record<string, DependencyInfo>;
	devDependencies: Record<string, DependencyInfo>;
	optionalDependencies: Record<string, DependencyInfo>;
}
