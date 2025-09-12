# Slack Quote Bot

A simple Slack bot that responds with random quotes when mentioned with the word "quote".

## Setup

1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Under "OAuth & Permissions", add the following bot token scopes:
   - `chat:write`
   - `app_mentions:read`
   - `channels:history`
3. Install the app to your workspace
4. Copy your Bot Token and Signing Secret
5. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```
   SLACK_SIGNING_SECRET=your_slack_signing_secret_here
   SLACK_BOT_TOKEN=your_slack_bot_token_here
   PORT=12000
   ```

## Installation

```bash
npm install
```

## Running the Bot

```bash
npm start
```

## Usage

In any channel where the bot is present, type "quote" and the bot will respond with a random quote.

## Dependencies

- @slack/bolt
- axios
- dotenv