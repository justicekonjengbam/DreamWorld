import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    const adminPassword = process.env.VITE_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
    const sheetApiUrl = process.env.VITE_SHEET_API_URL || process.env.SHEET_API_URL;

    if (!password || (adminPassword && password !== adminPassword)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!sheetApiUrl) {
        return res.status(500).json({ error: 'SheetDB API URL not configured' });
    }

    try {
        // Fetch all data from SheetDB
        const [qRes, rRes, cRes, eRes, aRes] = await Promise.all([
            fetch(`${sheetApiUrl}?sheet=quests`),
            fetch(`${sheetApiUrl}?sheet=roles`),
            fetch(`${sheetApiUrl}?sheet=members`),
            fetch(`${sheetApiUrl}?sheet=events`),
            fetch(`${sheetApiUrl}?sheet=announcements`)
        ]);

        const globalData = {
            quests: await qRes.json(),
            roles: await rRes.json(),
            characters: await cRes.json(),
            events: await eRes.json(),
            announcement: (await aRes.json())[0] || {},
            lastSynced: new Date().toISOString()
        };

        // Store in Vercel KV
        await kv.set('dreamworld_global_data', globalData);

        return res.status(200).json({ message: 'Sync Successful', lastSynced: globalData.lastSynced });
    } catch (error) {
        console.error('Sync Error:', error);
        return res.status(500).json({ error: 'Failed to sync data from SheetDB' });
    }
}
