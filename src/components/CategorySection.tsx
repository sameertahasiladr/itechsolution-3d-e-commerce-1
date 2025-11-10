'use client';

import { motion } from 'framer-motion';
import { Laptop, Monitor, Cable, Printer, Camera } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: 'Laptops',
    icon: Laptop,
    href: '/products?category=laptops',
    color: 'from-blue-500 to-blue-600',
    count: '15+ Models',
  },
  {
    name: 'Desktops',
    icon: Monitor,
    href: '/products?category=desktops',
    color: 'from-purple-500 to-purple-600',
    count: '10+ Models',
  },
  {
    name: 'Accessories',
    icon: Cable,
    href: '/products?category=accessories',
    color: 'from-green-500 to-green-600',
    count: '50+ Items',
  },
  {
    name: 'Printers',
    icon: Printer,
    href: '/products?category=printers',
    color: 'from-orange-500 to-orange-600',
    count: '8+ Models',
  },
  {
    name: 'CCTV',
    icon: Camera,
    href: '/products?category=cctv',
    color: 'from-red-500 to-red-600',
    count: '12+ Models',
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground">
            Find exactly what you need from our diverse product range
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-transparent overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-lg`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <category.icon className="w-10 h-10" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
