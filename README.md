# Slack + FreeScout Integration Bot

This project connects **FreeScout** with **Slack**.  
It listens for events from FreeScout and sends formatted messages to Slack users.

## What it does
- Sends a Slack message when a ticket is assigned to the user
- Notifies Slack users when a customer replies
- Posts internal note notifications to the right Slack user

## Roadmap
- [ ] Support natural language queries in Slack (e.g. "find the root cause of ticket #123")
- [ ] Add FreeScout tools (`get_ticket`, `analyze_ticket`, `add_note`, `update_ticket`, `search_tickets`)
- [ ] Generate draft replies using LLM
- [ ] Add Slack slash commands for ticket actions
- [ ] Add interactive modals for updating or replying to tickets
