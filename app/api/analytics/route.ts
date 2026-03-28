export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Generate realistic mock analytics data
    // In production, you would fetch this from PostHog using their API
    const mockAnalytics = {
      overview: {
        totalPageViews: Math.floor(Math.random() * 5000) + 1000,
        uniqueVisitors: Math.floor(Math.random() * 2000) + 500,
        avgSessionDuration: Math.floor(Math.random() * 180) + 60,
        bounceRate: Math.floor(Math.random() * 40) + 20,
      },
      trends: {
        pageViews: Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 200) + 50,
        })),
        visitors: Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100) + 20,
        })),
      },
      topPosts: [
        { title: 'Getting Started with Next.js', views: 1245, slug: 'getting-started-nextjs' },
        { title: 'React Hooks Deep Dive', views: 982, slug: 'react-hooks-deep-dive' },
        { title: 'Building a CMS with Sanity', views: 756, slug: 'building-cms-sanity' },
        { title: 'TypeScript Best Practices', views: 643, slug: 'typescript-best-practices' },
        { title: 'Stripe Integration Guide', views: 521, slug: 'stripe-integration-guide' },
      ],
      topReferrers: [
        { source: 'Google', visitors: 2341, percentage: 45 },
        { source: 'Direct', visitors: 1234, percentage: 24 },
        { source: 'Twitter', visitors: 567, percentage: 11 },
        { source: 'GitHub', visitors: 432, percentage: 8 },
        { source: 'LinkedIn', visitors: 321, percentage: 6 },
      ],
      devices: {
        desktop: 65,
        mobile: 28,
        tablet: 7,
      },
      browsers: [
        { name: 'Chrome', percentage: 58 },
        { name: 'Safari', percentage: 22 },
        { name: 'Firefox', percentage: 12 },
        { name: 'Edge', percentage: 8 },
      ],
    };

    return Response.json(mockAnalytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return Response.json(
      { message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
