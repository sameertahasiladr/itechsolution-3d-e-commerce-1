'use client';

import { useState } from 'react';
import { ProductImage } from '@/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePresets, transformImage } from '@/lib/cloudinary-transform';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sort images by isPrimary first, then displayOrder
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  if (sortedImages.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex];

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Display */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={ImagePresets.productDetail(currentImage.imageUrl)}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                className="object-cover"
                priority={selectedIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {sortedImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>

          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {sortedImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {sortedImages.map((image, index) => (
              <motion.button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative h-20 rounded-lg overflow-hidden border-2 transition-all',
                  selectedIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                )}
              >
                <Image
                  src={ImagePresets.thumbnail(image.imageUrl)}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {image.isPrimary && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                    Primary
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={ImagePresets.productDetail(currentImage.imageUrl)}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation in fullscreen */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
