'use client';

import { useState, useCallback } from 'react';
import { ProductImage } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Trash2,
  Star,
  StarOff,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ImagePresets } from '@/lib/cloudinary-transform';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductImageManagerProps {
  productId: number;
  images: ProductImage[];
  onImagesChange: () => void;
}

export default function ProductImageManager({
  productId,
  images,
  onImagesChange,
}: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const token = localStorage.getItem('bearer_token');

      try {
        // Upload to Cloudinary with compression
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'products');
          formData.append('compress', 'true'); // Enable compression

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          const uploadData = await uploadRes.json();
          return uploadData.data;
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        // Save to database
        const savePromises = uploadedFiles.map(async (file, index) => {
          const res = await fetch(`/api/products/${productId}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageUrl: file.secure_url,
              publicId: file.public_id,
              width: file.width,
              height: file.height,
              format: file.format,
              displayOrder: images.length + index,
              isPrimary: images.length === 0 && index === 0, // First image if no images exist
            }),
          });

          if (!res.ok) {
            throw new Error('Failed to save image');
          }
        });

        await Promise.all(savePromises);
        toast.success(`Uploaded ${files.length} image(s) successfully`);
        onImagesChange();
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload images');
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    },
    [productId, images.length, onImagesChange]
  );

  const handleSetPrimary = async (imageId: number) => {
    setLoadingIds((prev) => new Set(prev).add(imageId));
    const token = localStorage.getItem('bearer_token');

    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrimary: true }),
      });

      if (!res.ok) throw new Error('Failed to set primary image');

      toast.success('Primary image updated');
      onImagesChange();
    } catch (error) {
      console.error('Set primary error:', error);
      toast.error('Failed to set primary image');
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
  };

  const handleDelete = async (imageId: number) => {
    setLoadingIds((prev) => new Set(prev).add(imageId));
    const token = localStorage.getItem('bearer_token');

    try {
      const res = await fetch(`/api/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted');
      onImagesChange();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
      setDeleteId(null);
    }
  };

  const handleReorder = async (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = sortedImages.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedImages.length) return;

    setLoadingIds((prev) => new Set(prev).add(imageId));
    const token = localStorage.getItem('bearer_token');

    try {
      // Swap display orders
      const currentImage = sortedImages[currentIndex];
      const targetImage = sortedImages[targetIndex];

      await Promise.all([
        fetch(`/api/products/${productId}/images/${currentImage.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ displayOrder: targetImage.displayOrder }),
        }),
        fetch(`/api/products/${productId}/images/${targetImage.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ displayOrder: currentImage.displayOrder }),
        }),
      ]);

      toast.success('Order updated');
      onImagesChange();
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to reorder images');
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Images</h3>
        <label htmlFor="image-upload">
          <Button disabled={uploading} className="gap-2 cursor-pointer" asChild>
            <span>
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'Uploading...' : 'Upload Images'}
            </span>
          </Button>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {sortedImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No images uploaded yet</p>
            <label htmlFor="image-upload">
              <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Upload First Image
                </span>
              </Button>
            </label>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedImages.map((image, index) => {
            const isLoading = loadingIds.has(image.id);
            return (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={ImagePresets.productCard(image.imageUrl)}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.isPrimary && (
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                      Primary
                    </Badge>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground mb-3">
                    {image.width} × {image.height} · {image.format.toUpperCase()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!image.isPrimary && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={isLoading}
                        className="gap-1 flex-1"
                      >
                        <Star className="w-3 h-3" />
                        Set Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(image.id, 'up')}
                      disabled={isLoading || index === 0}
                      className="gap-1"
                    >
                      <MoveUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(image.id, 'down')}
                      disabled={isLoading || index === sortedImages.length - 1}
                      className="gap-1"
                    >
                      <MoveDown className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(image.id)}
                      disabled={isLoading}
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
