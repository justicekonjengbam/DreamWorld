import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { planId, customerName, customerEmail } = req.body;

    // Check for necessary environment variables
    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET;

    if (!keyId || !keySecret) {
        return res.status(500).json({
            error: 'Razorpay keys not configured. Please add RAZORPAY_SECRET to your environment variables.'
        });
    }

    if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required for subscriptions' });
    }

    try {
        const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        // Create a Subscription
        // Note: total_count is how many times the user will be charged.
        // We set a high number for "infinite" or handle it via dashboard.
        const subscription = await instance.subscriptions.create({
            plan_id: planId,
            total_count: 60, // 5 years monthly
            quantity: 1,
            customer_notify: 1, // Let Razorpay handle notifications
        });

        return res.status(200).json({
            subscriptionId: subscription.id,
            keyId: keyId
        });
    } catch (error) {
        console.error('Razorpay Subscription Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
