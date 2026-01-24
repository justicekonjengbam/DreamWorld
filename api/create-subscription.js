import Razorpay from 'razorpay';

export default async function handler(req, res) {
    // 1. Set headers for standard response
    res.setHeader('Content-Type', 'application/json');

    // 2. GET method for diagnostic ping
    if (req.method === 'GET') {
        const diagnostic = {
            status: "ready",
            environment: {
                has_key_id: !!(process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID),
                has_secret: !!(process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET),
                has_plan_id: !!(process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID)
            },
            instruction: "Please use POST to create a subscription."
        };
        return res.status(200).json(diagnostic);
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 3. Robust Body Parsing
        const body = req.body || {};
        const planId = body.planId || process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID;
        const customerName = body.customerName || "Dreamer";
        const customerEmail = body.customerEmail || "";

        // 4. Key Retrieval
        const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET;

        // 5. Validation with explicit error details
        const missing = [];
        if (!keyId) missing.push("VITE_RAZORPAY_KEY_ID");
        if (!keySecret) missing.push("RAZORPAY_SECRET");
        if (!planId) missing.push("VITE_RAZORPAY_PLAN_ID");

        if (missing.length > 0) {
            return res.status(500).json({
                error: `Configuration Missing: ${missing.join(", ")}`,
                details: "Please ensure these are added to your Vercel Environment Variables and you have Redeployed."
            });
        }

        // 6. Razorpay Initialization (Wrapped in try-catch)
        let instance;
        try {
            // Some environments/versions of Node require different import patterns for the Razorpay SDK
            // We use the standard class constructor
            const RazorpayClass = Razorpay.default || Razorpay;
            instance = new RazorpayClass({
                key_id: keyId,
                key_secret: keySecret,
            });
        } catch (initErr) {
            return res.status(500).json({ error: "Failed to initialize Razorpay client: " + initErr.message });
        }

        // 7. Subscription Creation
        const subscription = await instance.subscriptions.create({
            plan_id: planId,
            total_count: 60,
            quantity: 1,
            customer_notify: 1,
        });

        return res.status(200).json({
            subscriptionId: subscription.id,
            keyId: keyId
        });

    } catch (error) {
        console.error('CRITICAL BACKEND ERROR:', error);

        // Detailed error reporting for the user
        let friendlyMessage = error.message;
        if (friendlyMessage.includes('Unauthorized') || friendlyMessage.includes('401')) {
            friendlyMessage = "RAZORPAY ERROR: Your Secret Key is invalid or doesn't match this Key ID.";
        } else if (friendlyMessage.includes('BadRequestError') || friendlyMessage.includes('plan')) {
            friendlyMessage = `RAZORPAY ERROR: Plan ID not found. Ensure the Plan was created in LIVE MODE.`;
        }

        return res.status(500).json({
            error: friendlyMessage,
            raw: error.message
        });
    }
}
