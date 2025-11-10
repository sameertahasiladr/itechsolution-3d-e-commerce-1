'use client';

import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ImagePresets } from '@/lib/cloudinary-transform';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Get all product images sorted by primary first, then display order
  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      const sorted = [...product.images].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return a.displayOrder - b.displayOrder;
      });
      return sorted.map(img => img.imageUrl);
    }
    return product.image ? [product.image] : [];
  };

  const productImages = getProductImages();
  const hasMultipleImages = productImages.length > 1;

  // Handle swipe gesture
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (Math.abs(info.offset.x) > 10) {
      setIsDragging(true);
    }
    
    if (info.offset.x > swipeThreshold) {
      // Swiped right - go to previous image
      setCurrentImageIndex((prev) => 
        prev === 0 ? productImages.length - 1 : prev - 1
      );
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - go to next image
      setCurrentImageIndex((prev) => 
        prev === productImages.length - 1 ? 0 : prev + 1
      );
    }

    // Reset dragging state after a short delay
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
      onClick={handleCardClick}
    >
      <Card 
        className="h-full cursor-pointer overflow-hidden group border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl"
      >
        {/* Image Container with 3D Effect & Swipe */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              drag={hasMultipleImages ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              dragSnapToOrigin
              className="relative w-full h-full touch-pan-y"
              whileHover={{ scale: 1.1, rotateY: 5, rotateX: 5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {productImages.length > 0 ? (
                <Image
                  src={ImagePresets.productCard(productImages[currentImageIndex])}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover pointer-events-none select-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10 pointer-events-none">
            {product.condition === 'new' && (
              <Badge className="bg-green-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {product.condition === 'refurbished' && (
              <Badge className="bg-orange-500 text-white border-0">
                Refurbished
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-blue-500 text-white border-0">
                Featured
              </Badge>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <Badge variant="destructive">
                Only {product.stock} left!
              </Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Image Navigation Dots - Show when multiple images exist */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  onMouseEnter={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    currentImageIndex === index
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Swipe Indicator - Show on mobile for multiple images */}
          {hasMultipleImages && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                ← Swipe
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Swipe →
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}