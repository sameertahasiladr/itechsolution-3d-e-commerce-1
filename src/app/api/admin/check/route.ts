import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'No authentication token' 
        }, 
        { status: 401 }
      );
    }

    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'Invalid token format' 
        }, 
        { status: 401 }
      );
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'No authentication token' 
        }, 
        { status: 401 }
      );
    }

    // Query session by token
    const sessionResult = await db
      .select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'Invalid or expired session' 
        }, 
        { status: 401 }
      );
    }

    const userSession = sessionResult[0];

    // Check if session is expired
    const now = new Date();
    if (userSession.expiresAt < now) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'Invalid or expired session' 
        }, 
        { status: 401 }
      );
    }

    // Get user from session
    const userId = userSession.userId;

    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          error: 'User not found' 
        }, 
        { status: 404 }
      );
    }

    const currentUser = userResult[0];

    // Check if user has admin role
    if (currentUser.role === 'admin') {
      return NextResponse.json(
        { 
          isAdmin: true,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role
          }
        }, 
        { status: 200 }
      );
    }

    // User is authenticated but not admin
    return NextResponse.json(
      { 
        isAdmin: false 
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('GET /api/admin/check error:', error);
    return NextResponse.json(
      { 
        isAdmin: false,
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      }, 
      { status: 500 }
    );
  }
}