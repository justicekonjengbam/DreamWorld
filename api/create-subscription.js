import Razorpay from 'razorpay';

export default async function handler(req, res) {
    const keyId = (process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET || "").trim();
    const planId = (process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID || "").trim();

    // 1. GET method for diagnostic ping
    if (req.method === 'GET') {
        let sdkTest = "not_initialized";
        try {
            // Attempt standard initialization
            const r = new Razorpay({ key_id: 'test', key_secret: 'test' });
            sdkTest = "success";
        } catch (e) {
            sdkTest = "failed: " + e.message;
        }

        return res.status(200).json({
            status: "ready",
            sdk_init: sdkTest,
            keysFound: {
                keyId: !!keyId,
                keySecret: !!keySecret,
                planId: !!planId
            }
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!keyId || !keySecret || !planId) {
            throw new Error(`Missing required keys in Environment Variables. (Found: keyId:${!!keyId}, secret:${!!keySecret}, planId:${!!planId})`);
        }

        // Robust Initialization for Razorpay (supports ESM/CJS differences)
        const RazorpayClass = Razorpay.default || Razorpay;
        const rzp = new RazorpayClass({
            key_id: keyId,
            key_secret: keySecret,
        });

        // Create Subscription
        // Using the most basic parameters to avoid any SDK crashes
        const subscription = await rzp.subscriptions.create({
            plan_id: planId,
            total_count: 12, // 1 year
            quantity: 1,
            customer_notify: 1
        });

        return res.status(200).json({
            subscriptionId: subscription.id,
            keyId: keyId
        });

    } catch (error) {
        console.error('SERVER ERROR:', error.message);
        return res.status(500).json({
            error: error.message || 'Unknown Server Error',
            suggestion: 'Double check your Razorpay Secret and Plan ID (must be LIVE mode).'
        });
    }
}
