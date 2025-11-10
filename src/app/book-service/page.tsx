'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Wrench, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const productTypes = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'printer', label: 'Printer' },
  { value: 'camera', label: 'Camera' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'software', label: 'Software' },
  { value: 'cash', label: 'Cash Register/POS' },
];

export default function BookServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    productType: '',
    modelNumber: '',
    problemDescription: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.productType || !formData.problemDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Generate WhatsApp message
    let message = `🔧 *Service Booking Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    if (formData.email) message += `Email: ${formData.email}\n`;
    if (formData.address) message += `Address: ${formData.address}\n`;
    message += `\n*Product Information:*\n`;
    message += `Product Type: ${productTypes.find(p => p.value === formData.productType)?.label}\n`;
    if (formData.modelNumber) message += `Model Number: ${formData.modelNumber}\n`;
    message += `\n*Problem Description:*\n`;
    message += `${formData.problemDescription}\n`;
    message += `\nPlease contact me to schedule the service. Thank you!`;

    const url = `https://wa.me/919545690700?text=${encodeURIComponent(message)}`;

    // Handle iframe compatibility
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: 'OPEN_EXTERNAL_URL', data: { url } }, '*');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    toast.success('Redirecting to WhatsApp...');
  };

  return (
    <div className="min-h-screen pt-20 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
            <Wrench className="w-4 h-4" />
            <span className="font-medium">Service Request</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Book a Service</h1>
          <p className="text-lg text-muted-foreground">
            Fill out the form below and we'll get back to you via WhatsApp
          </p>
        </motion.div>

        {/* Service Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Customer Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Product Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productType">
                        Product Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.productType}
                        onValueChange={(value) => handleChange('productType', value)}
                        required
                      >
                        <SelectTrigger id="productType">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="modelNumber">Model Number (Optional)</Label>
                      <Input
                        id="modelNumber"
                        type="text"
                        placeholder="e.g., HP Pavilion 15"
                        value={formData.modelNumber}
                        onChange={(e) => handleChange('modelNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="problemDescription">
                      Problem Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="problemDescription"
                      placeholder="Describe the issue you're experiencing..."
                      value={formData.problemDescription}
                      onChange={(e) => handleChange('problemDescription', e.target.value)}
                      rows={5}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Book Service via WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Quick Response</h4>
              <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6 text-center">
              <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Expert Technicians</h4>
              <p className="text-sm text-muted-foreground">Certified professionals</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">WhatsApp Support</h4>
              <p className="text-sm text-muted-foreground">Direct communication</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground mb-2">
            Need immediate assistance?
          </p>
          <a
            href="tel:+919545690700"
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            Call: +91 9545690700
          </a>
        </motion.div>
      </div>
    </div>
  );
}