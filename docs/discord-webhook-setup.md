# Setting up a Discord webhook notification

If you want to configure notifications in the Astro Discord server, follow these steps:

1. On the Astro Discord server, navigate to `Server settings > Integrations > Webhooks` and click <kbd>New Webhook</kbd>.

2. Give it a name, icon, and a channel to post to.

3. Copy the webhook URL.

4. Open the [secrets settings for this repository](https://github.com/withastro/astro-ecosystem-ci/settings/secrets/actions) (requires admin privileges).

5. click on <kbd>New repository secret</kbd>.

6. Set the `Name` for the new secret to `DISCORD_WEBHOOK_URL`.

7. Paste the Discord webhook URL you copied into `Value`.

8. Click <kbd>Add secret</kbd>.
