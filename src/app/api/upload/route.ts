import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResponse, UploadError } from '@/lib/cloudinary.types';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'products';
    const compress = formData.get('compress') === 'true';

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' } as UploadError,
        { status: 400 }
      );
    }

    // File size validation (5MB per file)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds 5MB limit` } as UploadError,
        { status: 400 }
      );
    }

    // Upload file
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    const result = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      };

      // Apply compression settings
      if (compress) {
        uploadOptions.quality = 'auto:good';
        uploadOptions.transformation = [
          {
            width: 1200,
            height: 1200,
            crop: 'limit',
            quality: 'auto:good',
          }
        ];
      } else {
        uploadOptions.quality = 'auto';
      }

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResponse);
        }
      );

      stream.end(bytes);
    });

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
  } catch (error) {
    const err = error as UploadError;
    console.error('Upload error:', err);

    return NextResponse.json(
      {
        error: err.message || 'Upload failed',
        code: err.code,
      } as UploadError,
      { status: err.statusCode || 500 }
    );
  }
}