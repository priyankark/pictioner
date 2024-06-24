import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const BLOCKED_COUNTRIES = ['CN'];

export function middleware(req: NextRequest) {
  const country = req.geo?.country || 'US'

  if (BLOCKED_COUNTRIES.includes(country as string)) {
    return new Response('Blocked for legal reasons', { status: 451 })
  }
}