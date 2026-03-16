import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebase-server';
import { doc, getDoc } from 'firebase/firestore';

const DEFAULT_PLAN_PRICES: Record<string, number> = {
    'explorer': 650,
    'insider': 1500,
    'vip': 3200,
};

export async function POST(request: NextRequest) {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    
    if (!PAYSTACK_SECRET_KEY) {
        console.error('CRITICAL: PAYSTACK_SECRET_KEY is not defined in environment variables.');
        return NextResponse.json({ error: 'Paystack is not configured on the server. Please check environment variables.' }, { status: 500 });
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
                    explorer: firestorePrices.explorer || 650,
                    insider: firestorePrices.insider || 1500,
                    vip: firestorePrices.vip || 3200,
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

        // Paystack expects amount in smallest unit (cents/shillings * 100)
        const amountInCents = amount * 100;

        // Initialize Paystack transaction
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amountInCents,
                currency: 'KES',
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscribe/success`,
                metadata: {
                    userId,
                    planType,
                    billingCycle
                }
            }),
        });

        const data = await response.json();

        if (!data.status) {
            throw new Error(data.message || 'Failed to initialize Paystack transaction');
        }

        return NextResponse.json({ 
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference
        });

    } catch (error: any) {
        console.error('Paystack checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
