
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 12) {
      toast.error("Use a password with at least 12 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: formData.email.trim(),
        name: formData.name.trim(),
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success(
        "Account created. An existing administrator must grant admin access."
      );

      setIsRegistering(false);
      setFormData({
        name: "",
        email: formData.email.trim(),
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: true,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      // Verify the server-side Better Auth session and database role.
      const response = await fetch("/api/admin/check", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result.isAdmin !== true) {
        await authClient.signOut();
        toast.error(
          result.error || "Access denied. Admin privileges required."
        );
        return;
      }

      toast.success("Welcome, Admin!");
      onLogin();
    } catch (error) {
      console.error("Admin login failed:", error);
      toast.error("Could not verify admin access");
    } finally {
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
            {isRegistering ? "Create Account" : "Admin Login"}
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            {isRegistering
              ? "Create an account. Admin access must be granted separately."
              : "Sign in to access the admin dashboard"}
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={isRegistering ? handleRegister : handleLogin}
            className="space-y-4"
          >
            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email"
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={isRegistering ? "Create password" : "Enter password"}
                autoComplete={isRegistering ? "new-password" : "current-password"}
                disabled={loading}
                required
              />
            </div>

            {isRegistering && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Create Account"
                  : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormData({
                  name: "",
                  email: formData.email,
                  password: "",
                  confirmPassword: "",
                });
              }}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Need an account? Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
