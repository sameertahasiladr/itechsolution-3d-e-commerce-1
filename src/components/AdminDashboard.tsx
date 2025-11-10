'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Product, Order } from '@/types/product';
import ProductManagement from '@/components/ProductManagement';
import OrderManagement from '@/components/OrderManagement';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Clear token first
      localStorage.removeItem('bearer_token');
      
      // Sign out
      const { error } = await authClient.signOut();
      if (error?.code) {
        toast.error('Failed to logout');
        setIsLoggingOut(false);
        return;
      }
      
      toast.success('Logged out successfully');
      
      // Refetch session to update state
      await refetch();
      
      // Force immediate navigation and reload
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      setIsLoggingOut(false);
    }
  };

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'In Stock',
      value: products.filter(p => p.stock > 0).length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Revenue',
      value: `₹${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header with prominent logout button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and orders</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogout} 
            className="gap-2 min-w-[140px] shrink-0"
            disabled={isLoggingOut}
            size="lg"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-800 h-32 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement products={products} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement orders={orders} onUpdate={loadData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}