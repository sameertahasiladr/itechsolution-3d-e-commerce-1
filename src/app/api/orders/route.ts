import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, total, status, items } = body;

    // Validate required fields
    if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
      return NextResponse.json(
        { error: 'Customer name is required', code: 'MISSING_CUSTOMER_NAME' },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim() === '') {
      return NextResponse.json(
        { error: 'Customer phone is required', code: 'MISSING_CUSTOMER_PHONE' },
        { status: 400 }
      );
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Total must be a positive number', code: 'INVALID_TOTAL' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required', code: 'MISSING_ITEMS' },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return NextResponse.json(
          { error: 'Each item must have a productId', code: 'INVALID_ITEM' },
          { status: 400 }
        );
      }
      if (!item.productName || typeof item.productName !== 'string') {
        return NextResponse.json(
          { error: 'Each item must have a productName', code: 'INVALID_ITEM' },
          { status: 400 }
        );
      }
      if (!item.productPrice || typeof item.productPrice !== 'number' || item.productPrice <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a positive productPrice', code: 'INVALID_ITEM' },
          { status: 400 }
        );
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Each item must have a positive quantity', code: 'INVALID_ITEM' },
          { status: 400 }
        );
      }
    }

    // Validate status if provided
    const finalStatus = status || 'pending';
    if (!['pending', 'confirmed', 'completed'].includes(finalStatus)) {
      return NextResponse.json(
        {
          error: "Status must be one of: 'pending', 'confirmed', 'completed'",
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : null,
        total,
        status: finalStatus,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    const orderId = newOrder[0].id;

    // Create order items
    const itemsToInsert = items.map((item: any) => ({
      orderId,
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      createdAt: timestamp,
    }));

    const createdItems = await db
      .insert(orderItems)
      .values(itemsToInsert)
      .returning();

    return NextResponse.json(
      {
        ...newOrder[0],
        items: createdItems,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}