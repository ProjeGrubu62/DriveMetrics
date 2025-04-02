import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const year = searchParams.get('year');

  try {
    const searchQuery = `${brand} ${model} ${year} exterior`;
    console.log('Searching for:', searchQuery);
    
    const url = new URL('https://customsearch.googleapis.com/customsearch/v1');
    url.searchParams.append('key', process.env.GOOGLE_API_KEY || '');
    url.searchParams.append('cx', process.env.GOOGLE_CSE_ID || '');
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('searchType', 'image');
    url.searchParams.append('num', '1');
    url.searchParams.append('imgType', 'photo');
    url.searchParams.append('imgSize', 'large');

    console.log('API URL:', url.toString());
    console.log('API Key present:', !!process.env.GOOGLE_API_KEY);
    console.log('CSE ID present:', !!process.env.GOOGLE_CSE_ID);
    
    const response = await fetch(url);
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('Google API Error:', data.error);
      throw new Error(data.error?.message || 'API Error');
    }

    const imageUrl = data.items?.[0]?.link || '/images/vehicles/default-car.jpg';
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      imageUrl: '/images/vehicles/default-car.jpg',
      error: error.message 
    });
  }
}