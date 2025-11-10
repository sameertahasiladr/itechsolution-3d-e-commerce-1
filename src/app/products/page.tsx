'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, ProductCategory } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'laptops', label: 'Laptops' },
  { value: 'desktops', label: 'Desktops' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'printers', label: 'Printers' },
  { value: 'cctv', label: 'CCTV Cameras' },
];

const conditions = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'refurbished', label: 'Refurbished' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'new' | 'refurbished'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data: Product[] = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Handle URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.some(c => c.value === category)) {
      setSelectedCategory(category as ProductCategory);
    }
  }, [searchParams]);

  // Filter products
  useEffect(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition !== 'all') {
      result = result.filter(p => p.condition === selectedCondition);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedCondition]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCondition('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedCondition !== 'all';

  return (
    <div className="min-h-screen pt-20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of quality tech products. Find laptops, desktops, accessories, and more.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filters:</span>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Condition Filters */}
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <Button
                  key={condition.value}
                  variant={selectedCondition === condition.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCondition(condition.value as any)}
                >
                  {condition.label}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2 items-center"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}"
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary">
                Category: {categories.find(c => c.value === selectedCategory)?.label}
              </Badge>
            )}
            {selectedCondition !== 'all' && (
              <Badge variant="secondary">
                Condition: {conditions.find(c => c.value === selectedCondition)?.label}
              </Badge>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters}>Clear Filters</Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground">Loading products...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-800 h-96 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}