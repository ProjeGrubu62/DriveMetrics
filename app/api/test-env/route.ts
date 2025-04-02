import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.GOOGLE_API_KEY || 'not found',
    cseId: process.env.GOOGLE_CSE_ID || 'not found'
  });
}