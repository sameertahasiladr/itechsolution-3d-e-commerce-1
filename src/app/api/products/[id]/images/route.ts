import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productImages, products } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    // Validate productId is valid integer
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json(
        {
          error: 'Valid product ID is required',
          code: 'INVALID_PRODUCT_ID',
        },
        { status: 400 }
      );
    }

    const parsedProductId = parseInt(productId);

    // Query all images for the product ordered by displayOrder ASC, then id ASC
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, parsedProductId))
      .orderBy(asc(productImages.displayOrder), asc(productImages.id));

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    // Validate productId is valid integer
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json(
        {
          error: 'Valid product ID is required',
          code: 'INVALID_PRODUCT_ID',
        },
        { status: 400 }
      );
    }

    const parsedProductId = parseInt(productId);

    // Verify product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parsedProductId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        {
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { imageUrl, publicId, width, height, format, displayOrder, isPrimary } = body;

    // Validate required fields
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        {
          error: 'imageUrl is required and must be a non-empty string',
          code: 'MISSING_IMAGE_URL',
        },
        { status: 400 }
      );
    }

    if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
      return NextResponse.json(
        {
          error: 'publicId is required and must be a non-empty string',
          code: 'MISSING_PUBLIC_ID',
        },
        { status: 400 }
      );
    }

    if (!width || typeof width !== 'number' || width <= 0) {
      return NextResponse.json(
        {
          error: 'width is required and must be a positive integer',
          code: 'INVALID_WIDTH',
        },
        { status: 400 }
      );
    }

    if (!height || typeof height !== 'number' || height <= 0) {
      return NextResponse.json(
        {
          error: 'height is required and must be a positive integer',
          code: 'INVALID_HEIGHT',
        },
        { status: 400 }
      );
    }

    if (!format || typeof format !== 'string' || format.trim() === '') {
      return NextResponse.json(
        {
          error: 'format is required and must be a non-empty string',
          code: 'MISSING_FORMAT',
        },
        { status: 400 }
      );
    }

    // If isPrimary is true, set all other images for this product to isPrimary=false
    if (isPrimary === true) {
      await db
        .update(productImages)
        .set({ isPrimary: false })
        .where(eq(productImages.productId, parsedProductId));
    }

    // Prepare insert data
    const insertData = {
      productId: parsedProductId,
      imageUrl: imageUrl.trim(),
      publicId: publicId.trim(),
      width: width,
      height: height,
      format: format.trim(),
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isPrimary: isPrimary === true ? true : false,
      createdAt: new Date().toISOString(),
    };

    // Insert new image
    const newImage = await db
      .insert(productImages)
      .values(insertData)
      .returning();

    return NextResponse.json(newImage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}