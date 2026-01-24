import Razorpay from 'razorpay';

export default async function handler(req, res) {
    const logs = [];
    const addLog = (msg) => {
        logs.push(`${new Date().toISOString()}: ${msg}`);
        console.log(msg);
    };

    try {
        addLog("API Handler Started");

        // 1. Get Keys
        const keyId = (process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "").trim();
        const keySecret = (process.env.RAZORPAY_SECRET || process.env.VITE_RAZORPAY_SECRET || "").trim();
        const planId = (process.env.VITE_RAZORPAY_PLAN_ID || process.env.RAZORPAY_PLAN_ID || "").trim();

        addLog(`Keys identified - ID: ${!!keyId}, Secret: ${!!keySecret}, Plan: ${!!planId}`);

        if (req.method === 'GET') {
            return res.status(200).json({ status: "ok", logs, keys: { keyId: !!keyId, keySecret: !!keySecret, planId: !!planId } });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // 2. Body Check
        addLog("Processing POST Body");
        const body = req.body || {};
        const targetPlan = body.planId || planId;
        addLog(`Target Plan: ${targetPlan}`);

        if (!keyId || !keySecret || !targetPlan) {
            throw new Error(`Missing Configuration. KeysFound: ID=${!!keyId}, Secret=${!!keySecret}, Plan=${!!targetPlan}`);
        }

        // 3. SDK Init
        addLog("Initializing Razorpay SDK");
        const RazorpayClass = Razorpay.default || Razorpay;
        const rzp = new RazorpayClass({
            key_id: keyId,
            key_secret: keySecret
        });
        addLog("SDK Initialized Successfully");

        // 4. Subscription Creation
        addLog("Calling rzp.subscriptions.create");
        try {
            const subscription = await rzp.subscriptions.create({
                plan_id: targetPlan,
                total_count: 12,
                quantity: 1,
                customer_notify: 1
            });

            addLog(`Subscription Created: ${subscription.id}`);

            return res.status(200).json({
                success: true,
                subscriptionId: subscription.id,
                keyId: keyId,
                logs
            });
        } catch (subError) {
            addLog(`Subscription Call Failed: ${subError.message}`);
            return res.status(500).json({
                success: false,
                error: subError.message,
                code: subError.code,
                logs
            });
        }

    } catch (globalError) {
        addLog(`Global Error: ${globalError.message}`);
        return res.status(500).json({
            success: false,
            error: globalError.message,
            logs
        });
    }
}
