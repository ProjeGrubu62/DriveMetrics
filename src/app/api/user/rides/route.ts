import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { score } = await req.json();

    if (!score || typeof score !== 'number') {
      return NextResponse.json(
        { message: 'Geçerli bir puan gerekli' },
        { status: 400 }
      );
    }

    const ride = await prisma.ride.create({
      data: {
        userId: session.user.id,
        startTime: new Date(),
        averageSpeed: 0, // Bu değerler şimdilik 0, ileride gerçek verilerle güncellenecek
        maxSpeed: 0,
        fuelEfficiency: 0,
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error('Ride creation error:', error);
    return NextResponse.json(
      { message: 'Sürüş kaydedilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const rides = await prisma.ride.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.error('Rides fetch error:', error);
    return NextResponse.json(
      { message: 'Sürüşler getirilemedi' },
      { status: 500 }
    );
  }
} 