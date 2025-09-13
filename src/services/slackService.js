import { app } from '../slackApp.js';

export async function sendMessageToUser(userId, text, blocks = null) {
    try {
        const result = await app.client.chat.postMessage({
            token: process.env.SLACK_BOT_TOKEN,
            channel: userId,
            text: text || "🔔 New notification", // Slack requires fallback
            blocks
        });

        if (!result.ok) {
            console.error(`Failed to send message to ${userId}:`, result.error);
            return false;
        }

        return true;
    } catch (err) {
        console.error(`sendMessageToUser error (userId: ${userId}):`, err);
        return false;
    }
}

export async function findUserByEmail(email) {
    if (!email) {
        console.warn("findUserByEmail called with empty email");
        return null;
    }

    try {
        const result = await app.client.users.lookupByEmail({
            token: process.env.SLACK_BOT_TOKEN,
            email,
        });

        if (result.ok && result.user?.id) {
            return result.user.id;
        }

        console.warn(`Slack user not found for email: ${email}`);
        return null;
    } catch (err) {
        console.error(`findUserByEmail error (email: ${email}):`, err);
        return null;
    }
}
