import 'dotenv/config'; 
import { app, receiver } from './slackApp.js';
import freescoutRoutes from './routes/freescout.js';
// import { registerQueryHandler } from './handlers/queries.js';

// Attach FreeScout webhook routes
receiver.router.use('/freescout', freescoutRoutes);

// Register Slack query listener
// registerQueryHandler(app);

(async () => {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slack bot running on port ${port}`);
})();
