import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const serviceSupabase = createServiceRoleClient();
    const { error } = await serviceSupabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to upgrade:', error);
      return new Response('Failed to upgrade', { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
