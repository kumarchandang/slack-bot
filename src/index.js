import 'dotenv/config';
import { app } from './slackApp.js';

(async () => {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slack bot running on port ${port}`);
})();
