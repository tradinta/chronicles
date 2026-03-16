import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseServer } from '@/lib/firebase-server';
import { doc, getDoc } from 'firebase/firestore';

// Initialize Stripe with fallback for missing key during build
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' as any })
    : null;

// Default fallbacks in case Firestore doc is missing
const DEFAULT_PLAN_PRICES: Record<string, number> = {
    'explorer': 65000,
    'insider': 150000,
    'vip': 320000,
};

const PLAN_NAMES: Record<string, string> = {
    'explorer': 'Explorer Plan',
    'insider': 'Insider Plan',
    'vip': 'VIP Access',
};

export async function POST(request: NextRequest) {
    if (!stripe) {
        return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const { firestore } = getFirebaseServer();

    try {
        const { planType, userId, email, billingCycle } = await request.json();

        // 1. Fetch dynamic pricing from settings/site
        let planPrices = DEFAULT_PLAN_PRICES;
        try {
            const settingsSnap = await getDoc(doc(firestore, 'settings', 'site'));
            if (settingsSnap.exists() && settingsSnap.data().pricing) {
                const firestorePrices = settingsSnap.data().pricing;
                planPrices = {
                    explorer: (firestorePrices.explorer || 650) * 100,
                    insider: (firestorePrices.insider || 1500) * 100,
                    vip: (firestorePrices.vip || 3200) * 100,
                };
            }
        } catch (e) {
            console.error('Error fetching dynamic prices, using defaults:', e);
        }

        if (!planType || !planPrices[planType]) {
            return NextResponse.json({ error: 'Valid plan type is required' }, { status: 400 });
        }

        // Adjust for annual if needed (15% discount as per UI)
        let amount = planPrices[planType];
        if (billingCycle === 'annual') {
            amount = Math.round(amount * 12 * 0.85);
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'kes',
                        product_data: {
                            name: PLAN_NAMES[planType],
                            description: `Full access to The Chronicle - ${planType} level.`,
                        },
                        unit_amount: amount,
                        recurring: {
                            interval: billingCycle === 'annual' ? 'year' : 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscribe`,
            customer_email: email,
            metadata: {
                userId: userId || '',
                planType,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
