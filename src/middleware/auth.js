// Simple auth middleware: checks Authorization: Bearer <secret> or x-api-key header
export default function authenticate(req, res, next) {
    const secret = process.env.ROUTE_SECRET || process.env.API_KEY;
    if (!secret) {
        return res.status(500).json({ error: 'Server misconfigured: ROUTE_SECRET missing' });
    }
    const authHeader = req.get('authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const apiKey = req.get('x-api-key');
    if (bearer === secret || apiKey === secret) return next();
    return res.status(401).json({ error: 'Unauthorized' });
}