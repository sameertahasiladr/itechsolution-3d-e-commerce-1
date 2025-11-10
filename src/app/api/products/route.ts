import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(products);

    if (category) {
      query = query.where(eq(products.category, category));
    }

    const allProducts = await query.limit(limit).offset(offset);
    
    // Fetch images for each product
    const productsWithImages = await Promise.all(
      allProducts.map(async (product) => {
        const images = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(asc(productImages.displayOrder), asc(productImages.id));
        
        return {
          ...product,
          specifications: product.specifications 
            ? (typeof product.specifications === 'string' 
              ? JSON.parse(product.specifications) 
              : product.specifications)
            : [],
          images,
        };
      })
    );
    
    return NextResponse.json(productsWithImages);
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
    const { name, description, price, category, condition, image, stock, featured, specifications } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number', code: 'INVALID_PRICE' },
        { status: 400 }
      );
    }

    if (!category || !['laptops', 'desktops', 'accessories', 'printers', 'cctv'].includes(category)) {
      return NextResponse.json(
        {
          error: "Category must be one of: 'laptops', 'desktops', 'accessories', 'printers', 'cctv'",
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    if (!condition || !['new', 'refurbished'].includes(condition)) {
      return NextResponse.json(
        {
          error: "Condition must be one of: 'new', 'refurbished'",
          code: 'INVALID_CONDITION',
        },
        { status: 400 }
      );
    }

    // Validate stock if provided
    const finalStock = stock !== undefined ? stock : 0;
    if (typeof finalStock !== 'number' || finalStock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative integer', code: 'INVALID_STOCK' },
        { status: 400 }
      );
    }

    // Validate featured if provided
    const finalFeatured = featured !== undefined ? featured : false;
    if (typeof finalFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'Featured must be a boolean', code: 'INVALID_FEATURED' },
        { status: 400 }
      );
    }

    const newProduct = await db
      .insert(products)
      .values({
        name: name.trim(),
        description: description ? description.trim() : null,
        price,
        category,
        condition,
        image: image || null,
        stock: finalStock,
        featured: finalFeatured,
        specifications: specifications || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}