require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');
const express = require('express');

// Create the Express receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initialize Bolt app with receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: receiver,
});

// ---------------------
// Custom REST API for FreeScout
// ---------------------
receiver.router.post('/node_added', express.json(), async (req, res) => {
  let { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).send({ error: 'Missing email or message' });
  }

  // Normalize emails into an array
  if (!Array.isArray(email)) {
    email = [email]; // wrap single email into array
  }

  const results = [];

  try {
    for (const e of email) {
      try {
        // Lookup Slack user by email
        const user = await app.client.users.lookupByEmail({
          token: process.env.SLACK_BOT_TOKEN,
          email: e,
        });

        if (!user.ok || !user.user || !user.user.id) {
          results.push({ email: e, status: 'not_found' });
          continue;
        }

        // Send DM
        await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: user.user.id,
          text: message,
        });

        console.log(`Message sent to ${e}: ${message}`);
        results.push({ email: e, status: 'sent' });
      } catch (innerErr) {
        console.error(`Slack notify error for ${e}:`, innerErr);
        results.push({ email: e, status: 'error', error: innerErr.message });
      }
    }

    res.send({ success: true, results });
  } catch (err) {
    console.error('Slack notify error:', err);
    res.status(500).send({ error: 'Failed to process notifications' });
  }
});

// ---------------------
// Slack Bot Message Listener
// ---------------------
app.message(/^(hi|hello|hey).*/i, async ({ context, say }) => {
  const greeting = context.matches[0];
  await say(`${greeting}, how are you?`);
  console.log(`Responded to greeting: ${greeting}`);
});

// ---------------------
// Start the bot
// ---------------------
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt Slack bot running on port ${port}`);
})();
