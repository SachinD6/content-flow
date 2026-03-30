import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Check env vars
    if (!STRIPE_PRICES.PRO) {
      return new Response('Stripe price ID not configured', { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return new Response('App URL not configured', { status: 500 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get profile to check for existing stripe_customer_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return new Response('Failed to fetch profile', { status: 500 });
    }

    // Get or create Stripe customer
    let stripeCustomerId = profile?.stripe_customer_id;
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: { supabaseId: user.id },
        });
        stripeCustomerId = customer.id;

        // Save to profiles
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', user.id);

        if (updateError) {
          // Continue anyway - we can still create the checkout session
        }
      } catch {
        return new Response('Failed to create Stripe customer', { status: 500 });
      }
    }

    // Create Stripe Checkout Session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [{ price: STRIPE_PRICES.PRO, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?cancelled=true`,
        metadata: { userId: user.id },
      });

      return Response.json({ url: session.url });
    } catch {
      return new Response('Failed to create checkout session', { status: 500 });
    }
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
