import { queryMcp } from '../services/freescoutMcpService.js';

export function registerQueryHandler(app) {
    app.message(/ticket\s*#?(\d+)/i, async ({ context, say, message }) => {
        const ticketId = context.matches[1];
        try {
            const result = await queryMcp(`details of ticket ${ticketId}`);
            await say({
                thread_ts: message.ts,
                text: `📋 Ticket #${ticketId}:\n${JSON.stringify(result, null, 2)}`
            });
        } catch {
            await say({ thread_ts: message.ts, text: `❌ Could not fetch ticket #${ticketId}` });
        }
    });
    
    app.message(/^(what|show|get|list).*/i, async ({ message, say }) => {
        try {
            const result = await queryMcp(message.text);
            await say({
                thread_ts: message.ts,
                text: `🤖 From FreeScout MCP:\n${JSON.stringify(result, null, 2)}`
            });
        } catch {
            await say({ thread_ts: message.ts, text: `❌ MCP query failed` });
        }
    });
}
