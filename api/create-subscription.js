import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { planId, customerName, customerEmail } = req.body;

    // Check for necessary environment variables
    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET;
    const actualPlanId = planId || process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID;

    const foundKeys = {
        keyId: !!keyId,
        keySecret: !!keySecret,
        planIdInEnv: !!(process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID),
        planIdInRequest: !!planId
    };

    if (!keyId || !keySecret || !actualPlanId) {
        return res.status(500).json({
            error: `Missing Keys: ${JSON.stringify(foundKeys)}. Please check Vercel Environment Variables.`
        });
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
            plan_id: actualPlanId,
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

        // Return clear diagnostics to the user
        let message = error.message;
        if (message.includes('Unauthorized') || message.includes('401')) {
            message = "AUTHENTICATION FAILED: Your Key ID and Secret Key do not match. Check if you copied the Live Secret correctly.";
        } else if (message.includes('400') || message.includes('plan')) {
            message = `PLAN ERROR: The Plan ID '${actualPlanId}' was not found. ⚠️ You must create a NEW Plan while Razorpay is in LIVE MODE. Plans created in Test Mode will not work here.`;
        }

        return res.status(500).json({ error: message });
    }
}
