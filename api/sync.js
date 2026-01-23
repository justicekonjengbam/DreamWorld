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
        console.log("Starting Global Sync from SheetDB...");

        // Fetch all data from SheetDB
        const [qRes, rRes, cRes, eRes, aRes] = await Promise.all([
            fetch(`${sheetApiUrl}?sheet=quests`),
            fetch(`${sheetApiUrl}?sheet=roles`),
            fetch(`${sheetApiUrl}?sheet=quests`),
            fetch(`${sheetApiUrl}?sheet=roles`),
            fetch(`${sheetApiUrl}?sheet=dreamers`), // Changed from members
            fetch(`${sheetApiUrl}?sheet=events`),
            fetch(`${sheetApiUrl}?sheet=announcements`)
            fetch(`${sheetApiUrl}?sheet=events`),
            fetch(`${sheetApiUrl}?sheet=announcements`)
        ]);

        const qData = await qRes.json();
        const rData = await rRes.json();
        const cData = await cRes.json();
        const eData = await eRes.json();
        const aData = await aRes.json();

        // Check if SheetDB returned an error instead of an array
        const checkError = (data, name) => {
            if (!Array.isArray(data)) {
                return `Sheet "${name}" error: ${JSON.stringify(data).substring(0, 100)}`;
            }
            return null;
        };

        const errors = [
            checkError(qData, 'quests'),
            checkError(rData, 'roles'),
            checkError(qData, 'quests'),
            checkError(rData, 'roles'),
            checkError(cData, 'dreamers'), // Changed from members
            checkError(eData, 'events'),
            checkError(aData, 'announcements')
            checkError(eData, 'events'),
            checkError(aData, 'announcements')
        ].filter(Boolean);

        if (errors.length > 0) {
            throw new Error(`Sync blocked. Check Google Sheet setup:\n${errors.join('\n')}`);
        }

        // Helper to normalize keys to lowercase
        const normalize = (arr) => {
            if (!Array.isArray(arr)) return [];
            return arr.map(item => {
                const normalizedItem = {};
                Object.keys(item).forEach(key => {
                    normalizedItem[key.toLowerCase().trim()] = item[key];
                });
                return normalizedItem;
            });
        };

        const globalData = {
            quests: normalize(qData).filter(q => q.title),
            roles: normalize(rData).filter(r => r.name),
            characters: normalize(cData).filter(c => c.name),
            events: normalize(eData).filter(e => e.title),
            announcement: normalize([aData])[0] || {},
            lastSynced: new Date().toISOString()
        };

        // Store in Vercel KV
        await kv.set('dreamworld_global_data', globalData);

        return res.status(200).json({
            message: 'Sync Successful',
            lastSynced: globalData.lastSynced,
            details: {
                quests: qData.length,
                roles: rData.length,
                members: cData.length,
                events: eData.length
            }
        });
    } catch (error) {
        console.error('Sync Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}
