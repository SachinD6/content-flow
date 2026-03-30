import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { PostHog } from 'posthog-node';

export async function POST(request: Request) {
  // CRITICAL: Must use raw text — json() will break signature verification
  const body = await request.text();
  const headerList = await headers();
  const sig = headerList.get('stripe-signature');

  if (!sig) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        return new Response('No userId in metadata', { status: 400 });
      }

      // Use service role to bypass RLS
      const supabase = createServiceRoleClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'pro',
          stripe_subscription_id: session.subscription as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return new Response('Database update failed', { status: 500 });
      }

      // PostHog server-side event
      const posthogClient = new PostHog(
        process.env.NEXT_PUBLIC_POSTHOG_KEY!,
        { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
      );
      posthogClient.capture({
        distinctId: userId,
        event: 'upgrade_completed',
        properties: {
          plan: 'pro',
          userId,
          timestamp: new Date().toISOString(),
        },
      });
      await posthogClient.shutdown();

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const supabase = createServiceRoleClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);

      if (error) {
        // Silently handle error - subscription already deleted in Stripe
      }
      break;
    }

    default:
      // Unhandled event type
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
