'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  // Check admin status whenever session changes
  useEffect(() => {
    checkAdminStatus();
  }, [session?.user?.id, isPending]);

  const checkAdminStatus = async () => {
    if (isPending) return;
    
    if (!session?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check if user has admin role
    const token = localStorage.getItem('bearer_token');
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/check', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });

      const result = await response.json();
      setIsAdmin(result.isAdmin || false);
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    // Refetch session
    await refetch();
    
    // Wait a bit for session to update
    setTimeout(async () => {
      await checkAdminStatus();
      // Dispatch custom event to notify Navigation component
      window.dispatchEvent(new Event('adminLoginSuccess'));
    }, 500);
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLogin={handleLoginSuccess} />;
  }

  return <AdminDashboard />;
}