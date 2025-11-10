'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

// Helper function to wait for token
const waitForToken = (maxAttempts = 10, delayMs = 100): Promise<string | null> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkToken = () => {
      const token = localStorage.getItem('bearer_token');
      if (token) {
        resolve(token);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkToken, delayMs);
      } else {
        resolve(null);
      }
    };
    checkToken();
  });
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      // Register user with admin role
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (error?.code) {
        const errorMap: Record<string, string> = {
          USER_ALREADY_EXISTS: 'Email already registered',
        };
        toast.error(errorMap[error.code] || 'Registration failed');
        setLoading(false);
        return;
      }

      // Wait for token to be stored in localStorage
      const token = await waitForToken();
      
      if (!token) {
        toast.error('Failed to get authentication token');
        setLoading(false);
        return;
      }

      // Set admin role via API
      const roleResponse = await fetch('/api/admin/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: 'admin' })
      });

      if (!roleResponse.ok) {
        const errorData = await roleResponse.json();
        console.error('Failed to set admin role:', errorData);
        toast.error('Failed to set admin role. Please contact support.');
        await authClient.signOut();
        localStorage.removeItem('bearer_token');
        setLoading(false);
        return;
      }

      toast.success('Admin account created successfully!');
      onLogin();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: true,
      });

      if (error) {
        toast.error('Invalid email or password');
        setLoading(false);
        return;
      }

      // Wait for token to be stored in localStorage
      const token = await waitForToken();
      
      if (!token) {
        toast.error('Failed to get authentication token');
        setLoading(false);
        return;
      }

      // Check if user is admin
      const response = await fetch('/api/admin/check', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.isAdmin) {
        toast.success('Welcome, Admin!');
        onLogin();
      } else {
        toast.error('Access denied. Admin privileges required.');
        // Sign out non-admin user
        await authClient.signOut();
        localStorage.removeItem('bearer_token');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {isRegistering ? (
              <UserPlus className="w-8 h-8 text-blue-600" />
            ) : (
              <Lock className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isRegistering ? 'Admin Registration' : 'Admin Login'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isRegistering ? 'Create an admin account' : 'Access the admin dashboard'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                placeholder={isRegistering ? 'Create password' : 'Enter password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
                autoComplete="off"
              />
            </div>
            
            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isRegistering ? 'Creating Account...' : 'Logging in...') : (isRegistering ? 'Create Admin Account' : 'Login')}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              disabled={loading}
            >
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}