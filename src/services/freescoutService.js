const axios = require('axios');

const FREESCOUT_API = process.env.FREESCOUT_API_URL;

export async function getTicketDetails(ticketId) {
	const response = await axios.get(`${FREESCOUT_API}/tickets/${ticketId}`, {
		headers: { 'Authorization': `Bearer ${process.env.FREESCOUT_API_KEY}` }
	});
	return response.data;
}
