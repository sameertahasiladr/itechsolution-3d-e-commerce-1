import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authentication token' }, 
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' }, 
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
        { error: 'Invalid or expired session' }, 
        { status: 401 }
      );
    }

    const userSession = sessionResult[0];

    // Check if session is expired
    const now = new Date();
    if (userSession.expiresAt < now) {
      return NextResponse.json(
        { error: 'Invalid or expired session' }, 
        { status: 401 }
      );
    }

    // Get user from session
    const userId = userSession.userId;

    const body = await request.json();
    const { role } = body;

    if (!role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Update user role
    const updated = await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, userId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated[0].id,
        name: updated[0].name,
        email: updated[0].email,
        role: updated[0].role
      }
    });

  } catch (error) {
    console.error('POST /api/admin/set-role error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
