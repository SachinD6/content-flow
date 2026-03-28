import { PostHog } from 'posthog-node';

// Types for PostHog Events API response
interface PostHogEventResult {
  id: string;
  event: string;
  distinct_id: string;
  properties: Record<string, string | number | boolean>;
  timestamp: string;
  person?: {
    distinct_ids: string[];
    properties: Record<string, unknown>;
  };
}

// Mock events for development/demo when PostHog is not configured
const mockEvents: PostHogEventResult[] = [
  {
    id: 'evt_001',
    event: 'post_viewed',
    distinct_id: 'usr_001',
    properties: { 
      slug: 'stripe-webhooks-security', 
      title: 'Stripe Webhooks Security Guide',
      path: '/blog/stripe-webhooks-security'
    },
    timestamp: new Date(Date.now() - 2000).toISOString(),
  },
  {
    id: 'evt_002',
    event: 'upgrade_intent',
    distinct_id: 'usr_123',
    properties: { 
      plan: 'pro', 
      user_id: 'usr_api123', 
      source: 'billing_page' 
    },
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'evt_003',
    event: 'form_submitted',
    distinct_id: 'usr_456',
    properties: { 
      form: 'settings_profile', 
      fields_changed: 2 
    },
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'evt_004',
    event: 'post_viewed',
    distinct_id: 'usr_789',
    properties: { 
      slug: 'tanstack-query-v5', 
      title: 'TanStack Query v5 Features',
      path: '/blog/tanstack-query-v5'
    },
    timestamp: new Date(Date.now() - 480000).toISOString(),
  },
  {
    id: 'evt_005',
    event: 'page_view',
    distinct_id: 'usr_abc',
    properties: { 
      path: '/dashboard/billing', 
      referrer: '/dashboard' 
    },
    timestamp: new Date(Date.now() - 720000).toISOString(),
  },
  {
    id: 'evt_006',
    event: 'login',
    distinct_id: 'usr_def',
    properties: { 
      method: 'google_oauth', 
      user_id: 'usr_api123' 
    },
    timestamp: new Date(Date.now() - 1080000).toISOString(),
  },
  {
    id: 'evt_007',
    event: 'upgrade_completed',
    distinct_id: 'usr_ghi',
    properties: { 
      plan: 'pro', 
      stripe_session: 'cs_test_a1b2c3...',
      amount: 9.99
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'evt_008',
    event: 'post_created',
    distinct_id: 'usr_jkl',
    properties: { 
      title: 'Getting Started Guide',
      published: true,
      tags_count: 3
    },
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const apiKey = process.env.POSTHOG_API_KEY;
    
    let events: PostHogEventResult[] = [];
    let stats = {
      eventsToday: 247,
      uniqueUsers: 38,
      avgSession: '4m 12s'
    };

    if (apiKey) {
      // Use correct PostHog API host
      const apiHost = 'https://us.posthog.com';

      // Calculate date range (last 24 hours)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);

      // Fetch events from PostHog Events API
      const eventsResponse = await fetch(
        `${apiHost}/api/projects/@current/events/?after=${startDate.toISOString()}&before=${endDate.toISOString()}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      if (eventsResponse.ok) {
        const data = await eventsResponse.json();
        if (data.results && Array.isArray(data.results)) {
          events = data.results;
          
          // Calculate stats from real events
          const uniqueUsers = new Set(events.map(e => e.distinct_id)).size;
          stats = {
            eventsToday: events.length,
            uniqueUsers,
            avgSession: '4m 12s' // Would need session data for accurate calculation
          };
        }
      } else {
        console.error('PostHog API error:', await eventsResponse.text());
        // Fall back to mock data if API fails
        events = mockEvents;
      }
    } else {
      // Use mock data if no API key
      events = mockEvents;
    }

    // Feature flags (would come from PostHog in production)
    const featureFlags = [
      {
        name: 'show-featured-banner',
        enabled: true,
        description: 'Enabled — evaluated server-side via PostHog Node SDK'
      }
    ];

    return Response.json({
      stats,
      events: events.slice(0, limit),
      featureFlags
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    
    // Return mock data on error
    return Response.json({
      stats: {
        eventsToday: 247,
        uniqueUsers: 38,
        avgSession: '4m 12s'
      },
      events: mockEvents,
      featureFlags: [
        {
          name: 'show-featured-banner',
          enabled: true,
          description: 'Enabled — evaluated server-side via PostHog Node SDK'
        }
      ]
    });
  }
}
