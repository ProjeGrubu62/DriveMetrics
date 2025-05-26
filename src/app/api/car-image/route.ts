import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Google Custom Search API'yi kullanarak araç fotoğrafı çek
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    console.log('API Key:', apiKey);
    console.log('Search Engine ID:', searchEngineId);
    console.log('Query:', query);

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1`;
    console.log('Request URL:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response:', data);

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'No image found' }, { status: 404 });
    }

    return NextResponse.json({ imageUrl: data.items[0].link });
  } catch (error) {
    console.error('Error fetching car image:', error);
    return NextResponse.json({ error: 'Failed to fetch car image', details: error }, { status: 500 });
  }
} 