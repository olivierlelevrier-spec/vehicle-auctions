import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { announcementId, sellerEmail, buyerAmount, commission } = await req.json();

    // In production, create a real Stripe session
    // For now, return a placeholder checkout URL

    const sessionData = {
      id: `sess_${Date.now()}`,
      announcementId,
      sellerEmail,
      buyerAmount: parseInt(buyerAmount),
      commission: parseInt(commission), // 500 euros TTC
      totalAmount: parseInt(buyerAmount) + parseInt(commission),
      status: 'pending',
      checkoutUrl: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
    };

    // In production:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'eur',
    //       product_data: { name: 'Commission d\'enchère' },
    //       unit_amount: commission * 100,
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${req.headers.get('origin')}/payment/cancel`,
    // });

    return NextResponse.json({
      success: true,
      session: sessionData,
      message: 'Payment session created',
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
