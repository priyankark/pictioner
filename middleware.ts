import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const BLOCKED_COUNTRIES = [
    "AF",
    "BY",
    "CF",
    "CN",
    "CU",
    "ER",
    "IR",
    "KP",
    "RU",
    "SO",
    "SS",
    "SD",
    "SY",
    "VE"
  ];

export function middleware(req: NextRequest) {
  const country = req.geo?.country || 'US'

  if (BLOCKED_COUNTRIES.includes(country as string)) {
    return new Response('Blocked for legal reasons', { status: 451 })
  }
}