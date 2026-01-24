export default async function handler(req, res) {
    const keyId = (process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET || "").trim();
    const planId = (process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID || "").trim();

    if (req.method === 'GET') {
        return res.status(200).json({
            status: "ready",
            keysFound: { keyId: !!keyId, keySecret: !!keySecret, planId: !!planId }
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!keyId || !keySecret || !planId) {
            throw new Error(`Missing Configuration. ID:${!!keyId}, Secret:${!!keySecret}, Plan:${!!planId}`);
        }

        // Use Raw Fetch to avoid SDK crashes in Serverless
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify({
                plan_id: planId,
                total_count: 12,
                quantity: 1,
                customer_notify: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('RAZORPAY API ERROR:', {
                status: response.status,
                statusText: response.statusText,
                data: data,
                requestedPlanId: planId,
                keyIdUsed: keyId
            });
            throw new Error(data.error?.description || 'Razorpay API returned an error');
        }

        return res.status(200).json({
            subscriptionId: data.id,
            keyId: keyId
        });

    } catch (error) {
        console.error('SERVER ERROR:', {
            message: error.message,
            planId: planId,
            keyId: keyId,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({
            error: `${error.message}`,
            planId: planId,
            keyIdPrefix: keyId.substring(0, 13) + '...', // Show partial key for debugging
            suggestion: 'This Plan ID does not exist in the same Razorpay account as your Key ID. Check: 1) Plan exists and is active, 2) Both created in SAME MODE (live vs test), 3) Both from SAME Razorpay account.'
        });
    }
}
