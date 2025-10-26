'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowLeft } from 'lucide-react';

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Logging in...' : 'Log in'}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Libra</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg text-blue-100 mb-8">
            Manage your library with ease. Track books, members, and borrowings all in one place.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Comprehensive Catalog</p>
                <p className="text-sm text-blue-100">Manage thousands of books effortlessly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Real-Time Tracking</p>
                <p className="text-sm text-blue-100">Monitor borrowings and availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">Libra</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form action={dispatch}>
              <CardContent className="space-y-5">
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
                  />
                </div>
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-start gap-2">
                    <span className="text-red-500 font-semibold">✕</span>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <LoginButton />
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      New to Libra?
                    </span>
                  </div>
                </div>
                <Link href="/register" className="w-full">
                  <Button type="button" variant="outline" className="w-full">
                    Create an Account
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Admin: admin@libra.com / password</p>
              <p>Librarian: librarian@libra.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
