// Instead of named import, grab default pkg and destructure
import pkg from '@slack/bolt';

const { App, ExpressReceiver } = pkg;

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: receiver,
});

export { app, receiver };
