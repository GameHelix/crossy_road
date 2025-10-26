'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/lib/actions';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Books', href: '/dashboard/books', icon: BookOpen },
  { name: 'Members', href: '/dashboard/members', icon: Users },
  { name: 'Borrowings', href: '/dashboard/borrowings', icon: BookMarked },
];

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Libra</h1>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <h1 className="text-xl font-bold">Libra</h1>
                </div>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4">
                <NavigationLinks onNavigate={() => setOpen(false)} />
              </nav>
              <div className="border-t p-4">
                <form action={handleSignOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-600" />
            <h1 className="text-xl font-bold">Libra</h1>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <NavigationLinks />
        </nav>
        <div className="border-t p-4">
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
