'use client';

import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')})`;
    const url = `https://wa.me/919545690700?text=${encodeURIComponent(message)}`;
    
    // Handle iframe compatibility
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: 'OPEN_EXTERNAL_URL', data: { url } }, '*');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 pt-4">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
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

              {/* Stock Status */}
              <div className="absolute top-4 right-4">
                {product.stock > 0 ? (
                  <Badge className="bg-green-500 text-white border-0">
                    In Stock ({product.stock})
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            <div>
              <Badge variant="outline" className="uppercase">
                {product.category}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <ul className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1"
                onClick={handleWhatsAppInquiry}
              >
                Inquire on WhatsApp
              </Button>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Need help or have questions?
              </p>
              <a href="tel:+919545690700" className="font-semibold text-blue-600 hover:underline">
                Call: +91 9545690700
              </a>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}