import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "50",
      10
    );
    const requestedOffset = Number.parseInt(
      searchParams.get("offset") || "0",
      10
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.max(1, Math.min(requestedLimit, 100))
      : 50;
    const offset = Number.isFinite(requestedOffset)
      ? Math.max(0, requestedOffset)
      : 0;

    const allProducts = category
      ? await db
          .select()
          .from(products)
          .where(eq(products.category, category))
          .limit(limit)
          .offset(offset)
      : await db
          .select()
          .from(products)
          .limit(limit)
          .offset(offset);

    const productsWithImages = await Promise.all(
      allProducts.map(async (product) => {
        const images = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(
            asc(productImages.displayOrder),
            asc(productImages.id)
          );

        return {
          ...product,
          specifications: product.specifications ?? [],
          images,
        };
      })
    );

    return NextResponse.json(productsWithImages);
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      category,
      condition,
      image,
      stock,
      featured,
      specifications,
    } = body;

    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Name is required", code: "MISSING_NAME" },
        { status: 400 }
      );
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        { error: "Price must be a positive number", code: "INVALID_PRICE" },
        { status: 400 }
      );
    }

    if (
      !["laptops", "desktops", "accessories", "printers", "cctv"].includes(
        category
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Category must be one of: laptops, desktops, accessories, printers, cctv",
          code: "INVALID_CATEGORY",
        },
        { status: 400 }
      );
    }

    if (!["new", "refurbished"].includes(condition)) {
      return NextResponse.json(
        {
          error: "Condition must be new or refurbished",
          code: "INVALID_CONDITION",
        },
        { status: 400 }
      );
    }

    const finalStock = stock ?? 0;

    if (
      !Number.isInteger(finalStock) ||
      finalStock < 0
    ) {
      return NextResponse.json(
        {
          error: "Stock must be a non-negative integer",
          code: "INVALID_STOCK",
        },
        { status: 400 }
      );
    }

    const finalFeatured = featured ?? false;

    if (typeof finalFeatured !== "boolean") {
      return NextResponse.json(
        {
          error: "Featured must be a boolean",
          code: "INVALID_FEATURED",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newProduct = await db
      .insert(products)
      .values({
        name: name.trim(),
        description:
          typeof description === "string" ? description.trim() : null,
        price,
        category,
        condition,
        image: typeof image === "string" ? image : null,
        stock: finalStock,
        featured: finalFeatured,
        specifications: specifications ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("POST products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
