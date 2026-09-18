import { NextRequest, NextResponse } from 'next/server';

// Simple email notification service
export async function POST(req: NextRequest) {
  try {
    const { to, subject, bidderName, bidAmount, vehicleBrand, vehicleModel } = await req.json();

    // In production, use Sendgrid, AWS SES, etc.
    // For now, just log (can integrate real email later)
    console.log(`[EMAIL] To: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    console.log(`[EMAIL] Body: ${bidderName} placed a bid of €${bidAmount} on ${vehicleBrand} ${vehicleModel}`);

    // Simulate email sending
    return NextResponse.json({
      success: true,
      message: 'Email notification queued',
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
