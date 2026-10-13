
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Validate the Better Auth session using request cookies.
    const sessionData = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionData?.user?.id) {
      return NextResponse.json(
        {
          isAdmin: false,
          error: "Not authenticated. Please sign in again.",
        },
        { status: 401 }
      );
    }

    // Fetch the current user's role from PostgreSQL.
    const [currentUser] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, sessionData.user.id))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        {
          isAdmin: false,
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        {
          isAdmin: false,
          error: "Admin privileges required.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        isAdmin: true,
        user: currentUser,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/admin/check error:", error);

    return NextResponse.json(
      {
        isAdmin: false,
        error: "Failed to verify admin session.",
      },
      { status: 500 }
    );
  }
}
