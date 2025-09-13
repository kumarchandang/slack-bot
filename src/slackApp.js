import pkg from '@slack/bolt';
import express from 'express';
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

receiver.router.post('/node_added', handleNodeAdded);
receiver.router.post('/customer_replied', handleCustomerReply);
receiver.router.post('/ticket_assigned', handleTicketAssigned);

export { app, receiver };