require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  token: process.env['SLACK_BOT_TOKEN'],
});

/* Add functionality here */

(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);

    app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
        // RegExp matches are inside of context.matches
        const greeting = context.matches[0];

        await say(`${greeting}, how are you?`);
    });

  console.log('⚡️ Bolt app is running!');
})();