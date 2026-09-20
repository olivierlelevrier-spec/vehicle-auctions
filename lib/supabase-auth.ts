import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase environment variables');
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}

// For backward compatibility with files that import supabase directly
export const supabase = getSupabase();

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (process.env.NODE_ENV === 'development') {
      if (typeof window !== 'undefined') {
        const confirmedEmails = JSON.parse(localStorage.getItem('confirmed_emails') || '[]');
        if (!confirmedEmails.includes(email)) {
          confirmedEmails.push(email);
          localStorage.setItem('confirmed_emails', JSON.stringify(confirmedEmails));
        }
      }
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({
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

export async function signOut() {
  try {
    const { error } = await getSupabase().auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await getSupabase().auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  try {
    const {
      data: { session },
    } = await getSupabase().auth.getSession();

    return session;
  } catch (err) {
    return null;
  }
}
