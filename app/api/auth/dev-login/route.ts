import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev login only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { email, password } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Attempt standard login first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If successful, return
    if (!error && data.session) {
      return NextResponse.json({
        success: true,
        session: data.session,
        message: 'Logged in successfully',
      });
    }

    // If error is "Email not confirmed", we're in dev mode - bypass it
    if (error?.message?.includes('Email not confirmed')) {
      // Create a session token manually for dev purposes
      // This is a workaround for development
      const response = NextResponse.json({
        success: true,
        message: 'Dev login successful (email not confirmed - dev mode)',
        email: email,
        devMode: true,
      });

      // Set a dev auth cookie
      response.cookies.set('dev_auth_email', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Other errors
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
