'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Users, Award, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Every product undergoes rigorous testing to ensure the highest quality standards.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We provide exceptional customer service.',
  },
  {
    icon: Award,
    title: 'Expert Team',
    description: 'Our experienced technicians ensure every product meets your expectations.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery services to get your products to you fast.',
  },
];

const stats = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '5K+', label: 'Products Sold' },
  { number: '50+', label: 'Product Varieties' },
  { number: '99%', label: 'Satisfaction Rate' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  iTechSolution
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Your trusted partner for quality technology products since our inception. We specialize in providing
                both new and certified refurbished tech products including laptops, desktops, accessories, printers,
                and CCTV cameras.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is to make quality technology accessible to everyone while providing exceptional customer
                service and support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Our Team"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-2 hover:border-blue-500 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To provide high-quality, affordable technology solutions that empower individuals and businesses
                    to achieve their goals. We believe everyone deserves access to reliable technology, whether it's
                    new or expertly refurbished.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-2 hover:border-purple-500 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To become the most trusted technology solutions provider in India, known for our commitment to
                    quality, sustainability, and customer satisfaction. We aim to reduce e-waste while providing
                    exceptional value to our customers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white"
                    >
                      <value.icon className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose iTechSolution?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here's what makes us stand out from the competition
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Certified Products',
                description:
                  'All refurbished products are thoroughly tested and certified to ensure they meet our quality standards.',
              },
              {
                title: 'Warranty Coverage',
                description:
                  'We stand behind our products with comprehensive warranty coverage for your peace of mind.',
              },
              {
                title: 'Expert Support',
                description:
                  'Our knowledgeable team is always ready to help you find the perfect solution for your needs.',
              },
              {
                title: 'Competitive Pricing',
                description:
                  'Get the best value for your money with our competitive prices on both new and refurbished products.',
              },
              {
                title: 'Eco-Friendly',
                description:
                  'By choosing refurbished products, you\'re helping reduce e-waste and supporting sustainability.',
              },
              {
                title: 'Easy Returns',
                description:
                  'Not satisfied? We offer hassle-free returns and exchanges to ensure your complete satisfaction.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Contact us today and let our experts help you find the perfect technology solution
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+919545690700">
                <Button size="lg" variant="secondary" className="gap-2">
                  Call: +91 9545690700
                </Button>
              </a>
              <a href="https://wa.me/919545690700" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-600 gap-2">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}