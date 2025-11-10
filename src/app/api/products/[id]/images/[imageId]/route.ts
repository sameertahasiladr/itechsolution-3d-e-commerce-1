import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productImages } from '@/db/schema';
import { eq, and, not } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await params;

    // Validate IDs are valid integers
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    if (!imageId || isNaN(parseInt(imageId))) {
      return NextResponse.json(
        { error: 'Valid image ID is required', code: 'INVALID_IMAGE_ID' },
        { status: 400 }
      );
    }

    const parsedProductId = parseInt(productId);
    const parsedImageId = parseInt(imageId);

    // Verify image exists and belongs to the specified product
    const existingImage = await db
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.id, parsedImageId),
          eq(productImages.productId, parsedProductId)
        )
      )
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json(
        {
          error: 'Image not found or does not belong to this product',
          code: 'IMAGE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the image record
    await db
      .delete(productImages)
      .where(
        and(
          eq(productImages.id, parsedImageId),
          eq(productImages.productId, parsedProductId)
        )
      )
      .returning();

    return NextResponse.json(
      {
        message: 'Image deleted',
        id: parsedImageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: productId, imageId } = await params;

    // Validate IDs are valid integers
    if (!productId || isNaN(parseInt(productId))) {
      return NextResponse.json(
        { error: 'Valid product ID is required', code: 'INVALID_PRODUCT_ID' },
        { status: 400 }
      );
    }

    if (!imageId || isNaN(parseInt(imageId))) {
      return NextResponse.json(
        { error: 'Valid image ID is required', code: 'INVALID_IMAGE_ID' },
        { status: 400 }
      );
    }

    const parsedProductId = parseInt(productId);
    const parsedImageId = parseInt(imageId);

    // Parse request body
    const body = await request.json();
    const { isPrimary, displayOrder } = body;

    // Validate request body fields
    if (isPrimary !== undefined && typeof isPrimary !== 'boolean') {
      return NextResponse.json(
        {
          error: 'isPrimary must be a boolean',
          code: 'INVALID_IS_PRIMARY',
        },
        { status: 400 }
      );
    }

    if (
      displayOrder !== undefined &&
      (typeof displayOrder !== 'number' || displayOrder < 0 || !Number.isInteger(displayOrder))
    ) {
      return NextResponse.json(
        {
          error: 'displayOrder must be a non-negative integer',
          code: 'INVALID_DISPLAY_ORDER',
        },
        { status: 400 }
      );
    }

    // Verify image exists and belongs to the specified product
    const existingImage = await db
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.id, parsedImageId),
          eq(productImages.productId, parsedProductId)
        )
      )
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json(
        {
          error: 'Image not found or does not belong to this product',
          code: 'IMAGE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // If setting isPrimary to true, update all other images for this product to isPrimary=false
    if (isPrimary === true) {
      await db
        .update(productImages)
        .set({ isPrimary: false })
        .where(
          and(
            eq(productImages.productId, parsedProductId),
            not(eq(productImages.id, parsedImageId))
          )
        );
    }

    // Build update object with only provided fields
    const updateData: {
      isPrimary?: boolean;
      displayOrder?: number;
    } = {};

    if (isPrimary !== undefined) {
      updateData.isPrimary = isPrimary;
    }

    if (displayOrder !== undefined) {
      updateData.displayOrder = displayOrder;
    }

    // Update the image with provided fields
    const updatedImage = await db
      .update(productImages)
      .set(updateData)
      .where(
        and(
          eq(productImages.id, parsedImageId),
          eq(productImages.productId, parsedProductId)
        )
      )
      .returning();

    if (updatedImage.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update image',
          code: 'UPDATE_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedImage[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}