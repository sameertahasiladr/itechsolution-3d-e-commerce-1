import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, parseInt(id)));

    return NextResponse.json({
      ...order[0],
      items: items,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, customerName, customerPhone, customerEmail, total } = body;

    // Validate status if provided
    if (status && !['pending', 'confirmed', 'completed'].includes(status)) {
      return NextResponse.json(
        {
          error: "Status must be one of: 'pending', 'confirmed', 'completed'",
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Validate total if provided
    if (total !== undefined && (typeof total !== 'number' || total <= 0)) {
      return NextResponse.json(
        { error: 'Total must be a positive number', code: 'INVALID_TOTAL' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (customerName !== undefined) updateData.customerName = customerName.trim();
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone.trim();
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail ? customerEmail.trim().toLowerCase() : null;
    if (total !== undefined) updateData.total = total;

    const updated = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, parseInt(id)));

    return NextResponse.json({
      ...updated[0],
      items: items,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Delete order items first (cascade delete)
    await db
      .delete(orderItems)
      .where(eq(orderItems.orderId, parseInt(id)));

    // Delete order
    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Order deleted',
      id: parseInt(id),
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}