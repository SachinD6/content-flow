import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/sanity/content'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}
