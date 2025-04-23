import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;

  // Test search query
  const testQuery = 'Ford Mustang 2024';
  
  try {
    const url = new URL('https://customsearch.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey || '');
    url.searchParams.append('cx', cseId || '');
    url.searchParams.append('q', testQuery);
    url.searchParams.append('searchType', 'image');
    url.searchParams.append('num', '1');

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data: data,
      envCheck: {
        hasApiKey: !!apiKey,
        apiKeyStart: apiKey?.substring(0, 5),
        hasCseId: !!cseId,
        cseIdStart: cseId?.substring(0, 5)
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      envCheck: {
        hasApiKey: !!apiKey,
        apiKeyStart: apiKey?.substring(0, 5),
        hasCseId: !!cseId,
        cseIdStart: cseId?.substring(0, 5)
      }
    });
  }
} 