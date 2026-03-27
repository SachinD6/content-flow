// NEVER import this file in client components
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const STRIPE_PRICES = {
  PRO: process.env.STRIPE_PRO_PRICE_ID!,
};
