// MVP Authentication with real Supabase Auth + Profiles
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

// Lazy-load supabase client only at runtime
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    supabase = createClient(url, key);
  }
  return supabase;
}

// ============================================
// SIGNUP - Create user + profile
// ============================================
export async function signUpMVP(
  email: string,
  password: string,
  fullName: string,
  phone?: string
) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Signup failed' };
    }

    const userId = authData.user.id;

    // 2. Create profile in profiles table
    const { error: profileError } = await getSupabaseClient()
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          phone: phone || null,
          full_name: fullName,
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // User is created but profile failed - still consider success
      // User can be recreated on next login
    }

    return {
      success: true,
      data: authData,
      userId,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================
// LOGIN - Standard Supabase Auth
// ============================================
export async function signInMVP(email: string, password: string) {
  try {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================
// LOGOUT
// ============================================
export async function signOutMVP() {
  try {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================
// GET CURRENT USER
// ============================================
export async function getCurrentUserMVP() {
  try {
    const {
      data: { user },
      error,
    } = await getSupabaseClient().auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
}

// ============================================
// GET CURRENT SESSION
// ============================================
export async function getSessionMVP() {
  try {
    const {
      data: { session },
    } = await getSupabaseClient().auth.getSession();

    return session;
  } catch (err) {
    return null;
  }
}

// ============================================
// GET USER PROFILE
// ============================================
export async function getUserProfileMVP(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching profile:', err);
    return null;
  }
}

// ============================================
// UPDATE USER PROFILE
// ============================================
export async function updateProfileMVP(
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
