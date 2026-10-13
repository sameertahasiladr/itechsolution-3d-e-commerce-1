
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import type { UploadError } from "@/lib/cloudinary.types";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder =
      typeof folderValue === "string" && folderValue.trim()
        ? folderValue.trim()
        : "products";
    const compress = formData.get("compress") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json<UploadError>(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json<UploadError>(
        { message: `File ${file.name} exceeds 5MB limit` },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json<UploadError>(
        { message: "The uploaded file is empty" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const uploadOptions = {
      folder,
      resource_type: "auto" as const,
      use_filename: true,
      unique_filename: true,
      ...(compress
        ? {
            quality: "auto:good" as const,
            transformation: [
              {
                width: 1200,
                height: 1200,
                crop: "limit" as const,
                quality: "auto:good" as const,
              },
            ],
          }
        : {
            quality: "auto" as const,
          }),
    };

    const result = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (
            error: UploadApiErrorResponse | undefined,
            response: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
              return;
            }

            if (!response) {
              reject(new Error("Cloudinary returned no upload response"));
              return;
            }

            resolve(response);
          }
        );

        stream.end(bytes);
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);

    const err = error as Partial<UploadError>;

    const message =
      typeof err.message === "string"
        ? err.message
        : "Upload failed";

    const statusCode =
      typeof err.statusCode === "number" &&
      err.statusCode >= 400 &&
      err.statusCode <= 599
        ? err.statusCode
        : 500;

    return NextResponse.json<UploadError>(
      {
        message,
        ...(typeof err.code === "string" ? { code: err.code } : {}),
      },
      { status: statusCode }
    );
  }
}
