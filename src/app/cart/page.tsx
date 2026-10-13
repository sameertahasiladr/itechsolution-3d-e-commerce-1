'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Phone, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [courierCharge, setCourierCharge] = useState(0);

  // Calculate courier charge based on pincode (example logic)
  const calculateCourierCharge = (pin: string) => {
    if (!pin || pin.length < 6) {
      setCourierCharge(0);
      return;
    }
    
    // Example courier charge calculation
    // You can modify this logic based on your requirements
    const firstDigit = parseInt(pin.charAt(0));
    
    if (firstDigit <= 4) {
      setCourierCharge(50); // Local area
    } else if (firstDigit <= 7) {
      setCourierCharge(100); // Regional
    } else {
      setCourierCharge(150); // Long distance
    }
  };

  const handlePincodeChange = (value: string) => {
    setPincode(value);
    if (value.length === 6) {
      calculateCourierCharge(value);
      toast.success(`Courier charge: ₹${courierCharge === 50 ? 50 : courierCharge === 100 ? 100 : 150}`);
    } else {
      setCourierCharge(0);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const totalAmount = cartTotal + courierCharge;

  const generateWhatsAppMessage = () => {
    let message = `Hello! I'd like to order the following items from iTechSolution:\n\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price.toLocaleString('en-IN')} each\n`;
      message += `   Subtotal: ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n\n`;
    });
    
    message += `*Subtotal: ₹${cartTotal.toLocaleString('en-IN')}*\n`;
    if (courierCharge > 0) {
      message += `*Courier Charge: ₹${courierCharge.toLocaleString('en-IN')}*\n`;
    }
    message += `*Total Amount: ₹${totalAmount.toLocaleString('en-IN')}*\n\n`;
    
    if (customerName) {
      message += `Name: ${customerName}\n`;
    }
    if (customerPhone) {
      message += `Phone: ${customerPhone}\n`;
    }
    if (shippingAddress) {
      message += `Shipping Address: ${shippingAddress}\n`;
    }
    if (pincode) {
      message += `Pincode: ${pincode}\n`;
    }
    
    message += `\nPlease confirm my order. Thank you!`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!shippingAddress || !pincode) {
      toast.error('Please enter shipping address and pincode');
      return;
    }
    
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/919545690700?text=${message}`;
    
    // Handle iframe compatibility
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: 'OPEN_EXTERNAL_URL', data: { url } }, '*');
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCallOrder = () => {
    window.location.href = 'tel:+919545690700';
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products yet
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.id}`}>
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-4">
                            <div className="flex-1">
                              <Link href={`/products/${item.id}`}>
                                <h3 className="font-semibold text-lg mb-1 truncate hover:text-blue-600 cursor-pointer transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                {item.description}
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(String(item.id), item.name)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-4">
                            <span className="text-sm text-muted-foreground">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(String(item.id), item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(String(item.id), parseInt(e.target.value, 10) || 1)}
                                className="h-8 w-16 text-center border-0 focus-visible:ring-0"
                                min="1"
                                max={item.stock}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(String(item.id), item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <span className="text-sm font-semibold ml-auto">
                              Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-20"
            >
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold">Order Summary</h2>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Your Name (Optional)</Label>
                      <Input
                        id="customerName"
                        type="text"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Your Phone (Optional)</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>Shipping Address</span>
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingAddress">
                        Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="shippingAddress"
                        placeholder="Enter complete shipping address"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode">
                        Pincode <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        maxLength={6}
                        required
                      />
                      {courierCharge > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Courier charge calculated: ₹{courierCharge}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 py-4 border-y">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </span>
                      <span className="font-medium">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {courierCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Courier Charge
                        </span>
                        <span className="font-medium">
                          ₹{courierCharge.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Order Buttons */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full gap-2"
                      onClick={handleWhatsAppOrder}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Order via WhatsApp
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleCallOrder}
                    >
                      <Phone className="w-5 h-5" />
                      Call to Order
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Questions? We're here to help!
                    </p>
                    <a
                      href="tel:+919545690700"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      +91 9545690700
                    </a>
                  </div>

                  {/* Continue Shopping */}
                  <Link href="/products">
                    <Button variant="ghost" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}