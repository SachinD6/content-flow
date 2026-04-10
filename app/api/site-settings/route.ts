import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { DASHBOARD_NAV_QUERY } from '@/lib/sanity/queries'

export async function GET() {
  try {
    const data = await sanityClient.fetch<{
      dashboardNav: Array<Record<string, unknown>> | null
      dashboardFooterNav: Array<Record<string, unknown>> | null
    } | null>(DASHBOARD_NAV_QUERY)

    return NextResponse.json({
      dashboardNav: data?.dashboardNav || [],
      dashboardFooterNav: data?.dashboardFooterNav || [],
    })
  } catch (error) {
    console.error('Failed to fetch dashboard nav:', error)
    return NextResponse.json(
      { dashboardNav: [], dashboardFooterNav: [] },
      { status: 200 }
    )
  }
}
