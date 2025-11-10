import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

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

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch images for the product
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, parseInt(id)))
      .orderBy(asc(productImages.displayOrder), asc(productImages.id));

    // Parse specifications from JSON string to array
    const parsedProduct = {
      ...product[0],
      specifications: product[0].specifications 
        ? (typeof product[0].specifications === 'string' 
          ? JSON.parse(product[0].specifications) 
          : product[0].specifications)
        : [],
      images,
    };

    return NextResponse.json(parsedProduct);
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
    const { name, description, price, category, condition, image, stock, featured, specifications } = body;

    // Validate category if provided
    if (category && !['laptops', 'desktops', 'accessories', 'printers', 'cctv'].includes(category)) {
      return NextResponse.json(
        {
          error: "Category must be one of: 'laptops', 'desktops', 'accessories', 'printers', 'cctv'",
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Validate condition if provided
    if (condition && !['new', 'refurbished'].includes(condition)) {
      return NextResponse.json(
        {
          error: "Condition must be one of: 'new', 'refurbished'",
          code: 'INVALID_CONDITION',
        },
        { status: 400 }
      );
    }

    // Validate price if provided
    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    // Validate stock if provided
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative integer', code: 'INVALID_STOCK' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (condition !== undefined) updateData.condition = condition;
    if (image !== undefined) updateData.image = image || null;
    if (stock !== undefined) updateData.stock = stock;
    if (featured !== undefined) updateData.featured = featured;
    if (specifications !== undefined) updateData.specifications = specifications;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
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

    const deleted = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product deleted',
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