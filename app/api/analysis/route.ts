import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { vehicle, driveData, vehicleImage } = await request.json();
    
    // Store in session storage or your preferred storage method
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('analysisData', JSON.stringify({ 
        vehicle, 
        driveData,
        vehicleImage 
      }));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Analysis failed' });
  }
}