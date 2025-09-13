import express from 'express';
import { handleNodeAdded, handleCustomerReply, handleTicketAssigned } from '../handlers/ticketEvents.js';

const router = express.Router();

router.post('/node_added', handleNodeAdded);
router.post('/customer_replied', handleCustomerReply);
router.post('/ticket_assigned', handleTicketAssigned);

export default router;