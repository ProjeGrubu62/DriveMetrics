import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const year = searchParams.get('year');

  console.log('Received request for:', { brand, model, year });
  console.log('Environment variables:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    hasCseId: !!process.env.NEXT_PUBLIC_GOOGLE_CSE_ID,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.substring(0, 5) + '...',
    cseId: process.env.NEXT_PUBLIC_GOOGLE_CSE_ID?.substring(0, 5) + '...'
  });

  if (!brand || !model || !year) {
    console.error('Missing required parameters');
    return NextResponse.json({ 
      error: 'Missing required parameters',
      imageUrl: '/images/vehicles/default-car.jpg' 
    });
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY || !process.env.NEXT_PUBLIC_GOOGLE_CSE_ID) {
    console.error('Missing API credentials');
    return NextResponse.json({ 
      error: 'Missing API credentials',
      imageUrl: '/images/vehicles/default-car.jpg' 
    });
  }

  try {
    const searchQuery = `${brand} ${model} ${year} car exterior official press photo`;
    console.log('Search query:', searchQuery);
    
    const url = new URL('https://customsearch.googleapis.com/customsearch/v1');
    url.searchParams.append('key', process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    url.searchParams.append('cx', process.env.NEXT_PUBLIC_GOOGLE_CSE_ID);
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('searchType', 'image');
    url.searchParams.append('num', '1');
    url.searchParams.append('imgType', 'photo');
    url.searchParams.append('imgSize', 'large');
    url.searchParams.append('safe', 'active');

    console.log('Making API request to Google Custom Search');
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      console.error('Google API Error:', data);
      throw new Error(data.error?.message || 'API Error');
    }

    if (!data.items || data.items.length === 0) {
      console.log('No images found, using default');
      return NextResponse.json({ 
        imageUrl: '/images/vehicles/default-car.jpg',
        message: 'No images found' 
      });
    }

    const imageUrl = data.items[0].link;
    console.log('Found image URL:', imageUrl);
    
    return NextResponse.json({ 
      imageUrl,
      success: true 
    });
  } catch (error: any) {
    console.error('Error in vehicle-image API:', error);
    return NextResponse.json({ 
      error: error.message,
      imageUrl: '/images/vehicles/default-car.jpg'
    });
  }
}