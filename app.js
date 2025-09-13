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
receiver.router.post('/notify', express.json(), async (req, res) => {
  const { email, message } = req.body;
  
  if (!email || !message) {
    return res.status(400).send({ error: 'Missing email or message' });
  }
  
  try {
    // Lookup Slack user by email
    const user = await app.client.users.lookupByEmail({
      token: process.env.SLACK_BOT_TOKEN,
      email: email,
    });
    
    if (!user.ok || !user.user || !user.user.id) {
      return res.status(404).send({ error: 'Slack user not found' });
    }
    
    // Send DM
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: user.user.id,
      text: message,
    });
    
    console.log(`Message sent to ${email}: ${message}`);
    res.send({ success: true });
  } catch (err) {
    console.error('Slack notify error:', err);
    res.status(500).send({ error: 'Failed to send Slack message' });
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
