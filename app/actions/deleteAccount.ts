'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function deleteAccount(
  accountId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabaseSession = await createClient();
    const { data: { user }, error: sessionError } = await supabaseSession.auth.getUser();

    if (sessionError || !user) {
      return { success: false, error: 'Unauthorized user request' };
    }

    if (user.id !== accountId) {
      return { success: false, error: 'Authorization mismatch against active entity ID' };
    }

    const adminClient = createServiceRoleClient();
    const { error: deletionError } = await adminClient.auth.admin.deleteUser(accountId);

    if (deletionError) {
      return { success: false, error: deletionError.message };
    }

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Server error occurred during execution' };
  }
}
