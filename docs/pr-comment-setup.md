# Setting up PR comment triggers

## 1. Create a GitHub App

1. [Create a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app). Webhook is not needed.

   The following permissions are required:

   - **Metadata:** Read only
   - **Actions:** Read and Write
   - **Issues:** Read and Write
   - **Pull requests:** Read and Write

2. Install the app to the `withastro` org and give it access to `withastro/astro` and `withastro/astro-ecosystem-ci`.

3. Get the **App ID** for your app.

   You can find this at `https://github.com/settings/apps/<github-app-name-slug>`, for example:

   ![GitHub App ID](github_app_id.png)

4. Generate a private key.

   This can be generated on the same page as the App ID. The key will be downloaded when you generate it.

   ![GitHub App private key](github_app_private_key.png)

## 2. Add secrets to `withastro/astro` and `withastro/astro-ecosystem-ci`

- `withastro/astro`:
  - `ECOSYSTEM_CI_GITHUB_APP_ID`: ID of the created GitHub App
  - `ECOSYSTEM_CI_GITHUB_APP_PRIVATE_KEY`: the content of the private key of the created GitHub App
- `withastro/astro-ecosystem-ci`:
  - `PR_GITHUB_APP_ID`: ID of the created GitHub App
  - `PR_GITHUB_APP_PRIVATE_KEY`: the content of the private key of the created GitHub App

## 3. Add workflows to `withastro/astro`

Add [this workflow](https://github.com/vitejs/vite/blob/main/.github/workflows/ecosystem-ci-trigger.yml).
