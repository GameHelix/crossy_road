import { Sidebar } from '@/components/sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 lg:pt-0 pt-16">
        <div className="container mx-auto p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
