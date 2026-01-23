import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = await kv.get('dreamworld_global_data');

        if (!data) {
            return res.status(404).json({ error: 'No data synced yet. Please sync from Admin Dashboard.' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('KV Fetch Error:', error);
        return res.status(500).json({ error: 'Failed to fetch cached data' });
    }
}
