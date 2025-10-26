'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold">Libra</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our Library Today!</h2>
          <p className="text-lg text-purple-100 mb-8">
            Get instant access to thousands of books and enjoy seamless library management.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-purple-50">Free membership registration</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-purple-50">Access to extensive book catalog</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-purple-50">Track your borrowing history</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center gap-2 mb-2 lg:hidden">
                <BookOpen className="h-6 w-6 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">Libra</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-base">
                Register to access the library management system
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className="h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Main St, City, Country"
                    className="h-11"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-2">
                    <span className="text-red-500 font-semibold">✕</span>
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>
                <Link href="/login" className="w-full">
                  <Button type="button" variant="outline" className="w-full">
                    Sign In Instead
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
