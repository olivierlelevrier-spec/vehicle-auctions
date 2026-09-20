// MVP: Signup API
import { NextRequest, NextResponse } from 'next/server';
import { signUpMVP } from '@/lib/supabase-auth-mvp';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json();

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Call MVP signup
    const result = await signUpMVP(email, password, fullName, phone);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: result.userId,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
