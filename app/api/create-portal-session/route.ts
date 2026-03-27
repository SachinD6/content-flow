import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get profile to check for stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return new Response('No Stripe customer found', { status: 400 });
    }

    // Create Stripe Billing Portal Session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(message, { status: 500 });
  }
}
