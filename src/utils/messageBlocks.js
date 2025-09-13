export function buildBlock(text) {
    return [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: text
            }
        },
        {
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "🔗 Open in FreeScout"
                    },
                    url: url || "#",
                    action_id: "open_link"
                }
            ]
        }
    ];
}