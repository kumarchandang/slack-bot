import { sendMessageToUser, findUserByEmail } from '../services/slackService.js';
import { buildBlock } from '../utils/messageBlocks.js';

export async function handleNodeAdded(req, res) {
    try {
        const { email, conversation } = req.body;
        if (!email || !conversation) {
            return res.status(400).send({ error: "Missing email or conversation details" });
        }

        const { subject = 'a ticket', mailbox = 'FreeScout' } = conversation;
        await notifyUsers(
            req.app.client,
            email,
            buildBlock(`*You were mentioned in ${subject} - ${mailbox}*`),
            "📌 You were mentioned in a ticket"
        );

        res.send({ success: true });
    } catch (err) {
        console.error("handleNodeAdded error:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}

export async function handleCustomerReply(req, res) {
    try {
        const { email, conversation } = req.body;
        if (!email || !conversation) {
            return res.status(400).send({ error: "Missing email or conversation details" });
        }

        await notifyUsers(
            req.app.client,
            email,
            buildConversationBlock(conversation),
            "📩 Customer replied"
        );

        res.send({ success: true });
    } catch (err) {
        console.error("handleCustomerReply error:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}

export async function handleTicketAssigned(req, res) {
    try {
        const { email, ticket } = req.body;
        if (!email || !ticket) {
            return res.status(400).send({ error: "Missing email or ticket details" });
        }

        await notifyUsers(
            req.app.client,
            email,
            buildTicketAssignedBlock(ticket),
            "🎟️ Ticket assigned"
        );

        res.send({ success: true });
    } catch (err) {
        console.error("handleTicketAssigned error:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}

async function notifyUsers(client, emails, blocks, fallbackText = '🔔 FreeScout Notification') {
    try {
        if (!Array.isArray(emails)) {
            emails = [emails];
        }

        for (const e of emails) {
            try {
                const userId = await findUserByEmail(client, e);
                if (!userId) {
                    console.warn(`No Slack user found for email: ${e}`);
                    continue;
                }

                await sendMessageToUser(client, userId, fallbackText, blocks);
            } catch (err) {
                console.error(`Failed to notify ${e}:`, err);
            }
        }
    } catch (err) {
        console.error("notifyUsers error:", err);
    }
}
