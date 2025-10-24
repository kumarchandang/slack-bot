import pkg from '@slack/bolt';
import express from 'express';
import authenticate from './middleware/auth.js';
import { handleNodeAdded, handleCustomerReply, handleTicketAssigned } from './handlers/ticketEvents.js';

const { App, ExpressReceiver } = pkg;

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver,
});

receiver.router.use(express.json());

receiver.router.post('/node_added', authenticate, handleNodeAdded);
receiver.router.post('/customer_replied', authenticate, handleCustomerReply);
receiver.router.post('/ticket_assigned', authenticate, handleTicketAssigned);

export { app, receiver };