import { NextRequest, NextResponse } from 'next/server';
import { creem } from '@/lib/creem';

const PLANS: Record<string, any> = {
    'prod_PRO': {
        name: 'BonusLYF Pro',
        description: 'Monthly subscription for BonusLYF Pro',
        price: 2500,
        currency: 'USD',
        billingType: 'recurring',
        billingPeriod: 'every-month',
        imageUrl: 'https://bonuslyf.com/images/pro.png'
    },
    'prod_LIFETIME': {
        name: 'BonusLYF Lifetime',
        description: 'Lifetime access to BonusLYF',
        price: 30000,
        currency: 'USD',
        billingType: 'onetime',
        imageUrl: 'https://bonuslyf.com/images/lifetime.png'
    }
};

async function getOrCreateProduct(planKey: string) {
    const planDetails = PLANS[planKey];
    if (!planDetails) {
        throw new Error(`Invalid plan: ${planKey}`);
    }

    try {
        // List existing products to avoid duplicates
        // Note: we assume list returns an object with 'items' or 'data', or an array. 
        // Based on typical API patterns and camelCase conversion.
        const listResponse = await creem.products.list({ limit: 100 });
        const products = Array.isArray(listResponse) ? listResponse : ((listResponse as any).items || (listResponse as any).data || []);

        const existingProduct = products.find((p: any) => p.name === planDetails.name);

        if (existingProduct) {
            console.log(`Found existing product for ${planKey}: ${existingProduct.id}`);
            return existingProduct.id;
        }

        console.log(`Creating new product for ${planKey}...`);
        const newProduct = await creem.products.create(planDetails);
        console.log(`Created product: ${newProduct.id}`);
        return newProduct.id;

    } catch (error) {
        console.error("Error in getOrCreateProduct:", error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { productId } = await request.json();

        // Check if API key is present (server-side check)
        if (!process.env.CREEM_API_KEY) {
            throw new Error("CREEM_API_KEY is not configured on the server.");
        }

        // Resolve the real product ID (or create it)
        const realProductId = await getOrCreateProduct(productId);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const checkout = await creem.checkouts.create({
            productId: realProductId,
            successUrl: `${baseUrl}/success`,
        });

        return NextResponse.json({
            checkoutUrl: checkout.checkoutUrl
        });
    } catch (error: any) {
        console.error('Checkout API Error:', error?.message || error);
        // Log stack trace if available
        if (error.stack) console.error(error.stack);

        return NextResponse.json(
            { error: error?.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
