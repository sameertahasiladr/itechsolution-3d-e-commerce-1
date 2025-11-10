'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const products: Product[] = await res.json();
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 3));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "iTechSolution",
    "description": "Quality new and refurbished laptops, desktops, accessories, printers, and CCTV cameras in India",
    "url": typeof window !== 'undefined' ? window.location.origin : 'https://itechsolution.com',
    "telephone": "+919545690700",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "sameAs": [
      `https://wa.me/919545690700`
    ]
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Category Section */}
        <CategorySection />

        {/* Featured Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Featured Products</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Trending Now</h2>
              <p className="text-lg text-muted-foreground">
                Check out our most popular products this month
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link href="/products">
                <Button size="lg" className="gap-2 group">
                  View All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-4">
                Need Help Choosing the Right Product?
              </h2>
              <p className="text-lg mb-8 text-blue-100">
                Our team is here to help! Call us or send a message on WhatsApp for expert advice.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="tel:+919545690700">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Call Us: +91 9545690700
                  </Button>
                </a>
                <a
                  href="https://wa.me/919545690700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-600 gap-2">
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}