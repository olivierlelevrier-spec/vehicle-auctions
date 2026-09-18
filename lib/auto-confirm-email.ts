import { supabase } from './supabase-auth';

export async function autoConfirmEmail(email: string) {
  try {
    const { data, error } = await supabase.auth.admin?.updateUserById(
      email,
      { email_confirm: true }
    );

    if (error) {
      console.log('Auto-confirm not available in anon mode. Manual confirmation needed.');
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
