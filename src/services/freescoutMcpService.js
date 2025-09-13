import axios from 'axios';

const FREESCOUT_MCP_URL = process.env.FREESCOUT_MCP_URL;
const FREESCOUT_MCP_KEY = process.env.FREESCOUT_MCP_KEY;

export async function queryMcp(query) {
	const response = await axios.post(
		FREESCOUT_MCP_URL,
		{ query },
		{
			headers: {
				Authorization: `Bearer ${FREESCOUT_MCP_KEY}`,
				'Content-Type': 'application/json'
			}
		}
		
	);
	return response.data;
}
