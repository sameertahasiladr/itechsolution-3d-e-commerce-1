'use client';

import { useState } from 'react';
import { Order } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Calendar, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OrderManagementProps {
  orders: Order[];
  onUpdate: () => void;
}

export default function OrderManagement({ orders, onUpdate }: OrderManagementProps) {
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const updateOrderStatus = async (orderId: number | string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    setUpdatingStatus(Number(orderId));
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success(`Order status updated to ${newStatus}`);
      onUpdate();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}`;
    
    // Check if running in iframe
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground">
            Orders will appear here when customers place them
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Order #{order.id}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <Badge
                        className={
                          order.status === 'completed'
                            ? 'bg-green-500'
                            : order.status === 'confirmed'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-sm mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.customerName}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span className="hover:text-foreground cursor-pointer" onClick={() => handleCall(order.customerPhone)}>
                            {order.customerPhone}
                          </span>
                        </div>
                        {order.customerEmail && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${order.customerEmail}`} className="hover:text-foreground">
                              {order.customerEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-muted-foreground text-xs">
                                Qty: {item.quantity} × ₹{item.productPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₹{(item.productPrice * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-semibold text-lg">Total Amount</span>
                      <span className="font-bold text-2xl text-blue-600">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-48 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleWhatsApp(order.customerPhone)}
                    >
                      Contact via WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleCall(order.customerPhone)}
                    >
                      Call Customer
                    </Button>
                    
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Update Status:</p>
                      {order.status !== 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          disabled={updatingStatus === Number(order.id)}
                        >
                          {updatingStatus === Number(order.id) ? 'Updating...' : 'Mark Confirmed'}
                        </Button>
                      )}
                      {order.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          disabled={updatingStatus === Number(order.id)}
                        >
                          {updatingStatus === Number(order.id) ? 'Updating...' : 'Mark Completed'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}