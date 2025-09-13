export async function sendMessageToUser(client, userId, text, blocks = null) {
    try {
        const result = await client.chat.postMessage({
            channel: userId,
            text: text || "🔔 New notification", // Slack requires fallback
            blocks: blocks || undefined
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

export async function findUserByEmail(client, email) {
    if (!email) {
        console.warn("findUserByEmail called with empty email");
        return null;
    }

    try {
        const result = await client.users.lookupByEmail({ email });

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
