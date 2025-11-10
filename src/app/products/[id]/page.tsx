'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Sparkles,
  Phone,
  MessageCircle,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';
import ProductImageGallery from '@/components/ProductImageGallery';
import { ImagePresets } from '@/lib/cloudinary-transform';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data: Product = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const message = `Hi, I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')})`;
    const url = `https://wa.me/919545690700?text=${encodeURIComponent(message)}`;
    
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: 'OPEN_EXTERNAL_URL', data: { url } }, '*');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-12">
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section - Use Gallery if images exist, fallback to single image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {product.images && product.images.length > 0 ? (
              <ProductImageGallery images={product.images} productName={product.name} />
            ) : (
              <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.image ? ImagePresets.productDetail(product.image) : product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  {product.condition === 'new' && (
                    <Badge className="bg-green-500 text-white border-0 text-sm px-3 py-1">
                      <Sparkles className="w-4 h-4 mr-1" />
                      New
                    </Badge>
                  )}
                  {product.condition === 'refurbished' && (
                    <Badge className="bg-orange-500 text-white border-0 text-sm px-3 py-1">
                      Refurbished
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="bg-blue-500 text-white border-0 text-sm px-3 py-1">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <Badge variant="outline" className="uppercase text-sm">
              {product.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>

            {/* Condition Badge */}
            <div className="flex gap-2">
              {product.condition === 'new' && (
                <Badge className="bg-green-500 text-white border-0">
                  <Sparkles className="w-4 h-4 mr-1" />
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

            {/* Price and Stock */}
            <div className="flex items-center gap-6 py-4 border-y">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-5xl font-bold text-blue-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-600">In Stock</p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} units available
                      </p>
                    </div>
                  </div>
                ) : (
                  <Badge variant="destructive" className="text-sm">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this product</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <ul className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    -
                  </Button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full gap-2 h-14 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsAppInquiry}
                  className="gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
                <a href="tel:+919545690700">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="w-5 h-5" />
                    Call Us
                  </Button>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Need help?</strong> Our team is here to assist you
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+919545690700"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    📞 +91 9545690700
                  </a>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="font-semibold text-blue-600 hover:underline text-left"
                  >
                    💬 Chat on WhatsApp
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}