import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { serviceRoleKey } = await req.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: 'Missing serviceRoleKey or SUPABASE_URL' },
        { status: 400 }
      );
    }

    // Disable email confirmation
    const response = await fetch(
      `${supabaseUrl}/auth/v1/admin/config`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          external: {
            email: {
              enabled: true,
              confirmations_enabled: false,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Supabase API error: ${error}` },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmation disabled',
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
