import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('creem-signature');

    // Verify webhook signature
    if (!process.env.CREEM_WEBHOOK_SECRET) {
        console.warn("CREEM_WEBHOOK_SECRET is not set, skipping signature verification.");
        // In dev, sometimes we might want to skip, but better to log error.
    } else {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET!)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }
    }


    const event = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
        case 'checkout.completed':
            console.log('Payment successful!', {
                checkoutId: event.data.id,
                customerId: event.data.customer_id,
                productId: event.data.product_id,
            });
            // Grant access, send email, update database, etc.
            break;

        case 'subscription.created':
            console.log('New subscription:', event.data);
            break;

        case 'subscription.canceled':
            console.log('Subscription canceled:', event.data);
            // Revoke access
            break;
    }

    return NextResponse.json({ received: true });
}
