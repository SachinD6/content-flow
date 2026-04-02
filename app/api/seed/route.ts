import { NextRequest, NextResponse } from 'next/server'
import { seedCMS, resetCMS } from '@/lib/sanity/seed'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { reset } = body

    const results = reset ? await resetCMS() : await seedCMS()

    return NextResponse.json({
      success: results.errors.length === 0,
      message: reset ? 'CMS content reset to defaults' : 'CMS content seeded successfully',
      results: {
        siteSettings: results.siteSettings,
        navigation: results.navigation,
        homePage: results.homePage,
        authPages: results.authPages,
        dashboardSettings: results.dashboardSettings,
      },
      errors: results.errors.length > 0 ? results.errors : undefined,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed CMS content' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const results = await seedCMS()

  return NextResponse.json({
    success: results.errors.length === 0,
    message: 'CMS content seeded successfully',
    results: {
      siteSettings: results.siteSettings,
      navigation: results.navigation,
      homePage: results.homePage,
      authPages: results.authPages,
      dashboardSettings: results.dashboardSettings,
    },
    errors: results.errors.length > 0 ? results.errors : undefined,
  })
}