import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json(
        {
          error: 'Username is required',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return NextResponse.json(
        {
          error: 'Password is required',
          code: 'MISSING_CREDENTIALS',
        },
        { status: 400 }
      );
    }

    // Query database for admin user by username
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username.trim()))
      .limit(1);

    // If user not found, return consistent error message
    if (users.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password incorrect, return consistent error message
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Successful login - return user data without password
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        admin: {
          id: user.id,
          username: user.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}