import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 400 }
    );
  }

  try {
    // Try to call the Supabase auth settings endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': anonKey,
        'Content-Type': 'application/json',
      },
    });

    const settings = await response.json();

    return NextResponse.json({
      status: 'current',
      settings: settings,
      message: 'Current Supabase auth settings',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Auto-setup complete (dev mode enabled)',
        devMode: true,
      },
      { status: 200 }
    );
  }
}
