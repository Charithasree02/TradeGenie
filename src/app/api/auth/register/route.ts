import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { firstName, lastName, email, password, company, phone, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      console.log('Missing required fields:', { firstName, lastName, email, password: !!password, role });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking if user exists:', email);
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    console.log('Creating user...');
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        company,
        phone,
        role,
        preferences: {
          language: 'en',
          timezone: 'UTC',
          notifications: true
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    console.log('User created successfully:', user.id);

    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}