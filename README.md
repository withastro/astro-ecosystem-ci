# astro-ecosystem-ci

This repository is used to run integration tests for Astro ecosystem projects.

## Running tests

### GitHub workflows

#### Scheduled runs

Workflows are scheduled to run automatically every Monday, Wednesday and Friday.

#### Manual runs

If you are an Astro maintainer, follow these steps to trigger a manual run for one of the ecosystem test suites:

1. Open the [ecosystem CI workflow](https://github.com/withastro/astro-ecosystem-ci/actions/workflows/ecosystem-ci-selected.yml) on GitHub.
2. Click the <kbd>Run workflow</kbd> button at the top right of the list.
3. Select the test suite to run from the dropdown menu.
4. Confirm by clicking <kbd>Run workflow</kbd>.

#### Trigger a workflow run with a PR comment

Astro maintainers can trigger a workflow run with a comment in an Astro PR (requires triage permissions for the `withastro/astro` repository).

To trigger a run, comment `/ecosystem-ci run` on a PR.

You can optionally specify a test suite in the comment: `/ecosystem-ci run <suitename>`

See the [“Setting up PR comment triggers”](./docs/pr-comment-setup.md) guide for how to configure this feature.

### Run tests locally

1. Clone this repo

2. Install dependencies:

   ```sh
    pnpm install
   ```

3. Run all tests or a single suite as required:

   ```sh
   # run all tests:
   pnpm test
   # run a single test suite, e.g. pnpm test adapters
   pnpm test <suitename>
   ```

   **Optional flags:**

   You can pass options to the CLI command to select a specific Astro version to use with tests:

   - `--tag v2.8.0-beta.1` — use a specific Git tag in the Astro repo
   - `--branch somebranch` — use a specific Git branch in the Astro repo
   - `--commit abcd1234` — use a specific Git hash in the Astro repo
   - `--release 2.7.13` — fetch the specified release from the NPM registry (this will skip building Astro from source)

The repositories for each test suite are checked out into the `workspace/` subdirectory as shallow clones.

## How to add a new test suite

1. If you are not an Astro maintainer, fork and clone this repository.

2. Create a new file in the [tests/](./tests/) directory.

3. Export a `test()` function, which calls the `runInRepo()` utility to configure and run tests for your project.

   For example, the following test would clone a fictional `nasa/apollo` repo from GitHub, set up overrides for internal Astro packages, and run the `test` script specified in that repo’s `package.json`:

   ```ts
   // tests/nasa-apollo.ts
   import type { RunOptions } from "../types.d.ts";
   import { runInRepo } from "../utils.ts";

   export async function test(options: RunOptions) {
   	await runInRepo({
   		...options,
   		repo: "nasa/apollo",
   		overrides: {
   			"@astrojs/internal-helpers": true,
   			"@astrojs/markdown-remark": true,
   			"@astrojs/prism": true,
   			"@astrojs/telemetry": true,
   		},
   		test: "test",
   	});
   }
   ```

   Use the existing tests as a guide for common patterns in test files.

4. Test your changes locally by running:

   ```sh
   pnpm test your-file-name-here
   ```

5. Once you are confident your new test suite works, add its name to the lists of suites in the [GitHub workflow configuration files](./.github/workflows/).

   1. In [`ecosystem-ci-from-pr.yml`](./.github/workflows/ecosystem-ci-from-pr.yml), add your suite name to:

      - `on.workflow_dispatch.inputs.suite.options`
      - `jobs.execute-all.strategy.matrix.suite`

   2. In [`ecosystem-ci-selected.yml`](./.github/workflows/ecosystem-ci-selected.yml), add your suite name to:

      - `on.workflow_dispatch.inputs.suite.options`

   3. In [`ecosystem-ci.yml`](./.github/workflows/ecosystem-ci.yml), add your suite name to`:

      - `jobs.test-ecosystem.strategy.matrix.suite`

6. Open a PR adding your new files.

## Reporting results

### On Discord

Results are posted automatically to the `#ecosystem-ci` channel in the [Astro Discord server](https://astro.build/chat).

See the [“Setting up a Discord webhook notification”](./docs/discord-webhook-setup.md) guide for how to configure this initially.
