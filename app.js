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
  let { email, conversation } = req.body;

  if (!email || !conversation || !conversation.url) {
    return res.status(400).send({ error: 'Missing email or conversation details' });
  }

  if (!Array.isArray(email)) {
    email = [email];
  }

  const results = [];

  for (const e of email) {
    try {
      const user = await app.client.users.lookupByEmail({
        token: process.env.SLACK_BOT_TOKEN,
        email: e,
      });

      if (!user.ok || !user.user || !user.user.id) {
        results.push({ email: e, status: 'not_found' });
        continue;
      }

      // Fallbacks if subject/mailbox not provided
      const subject = conversation.subject || '';
      const mailbox = conversation.mailbox || '';

      // Slack Block Kit message
      const blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*You were mentioned in ${subject} - ${mailbox}*`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "🔗 Open Conversation"
              },
              url: conversation.url,
              action_id: "open_conversation"
            }
          ]
        }
      ];

      // Send interactive message
      await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: user.user.id,
        text: `You were mentioned in a conversation (Subject: ${subject})`, // fallback text
        blocks
      });

      results.push({ email: e, status: 'sent' });
    } catch (err) {
      console.error(`Slack notify error for ${e}:`, err);
      results.push({ email: e, status: 'error', error: err.message });
    }
  }

  res.send({ success: true, results });
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
