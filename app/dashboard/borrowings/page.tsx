import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookMarked } from 'lucide-react';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

async function getBorrowings() {
  const borrowings = await prisma.borrowing.findMany({
    include: {
      book: {
        select: {
          title: true,
          author: true,
          isbn: true,
        },
      },
      member: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { borrowDate: 'desc' },
    take: 20,
  });
  return borrowings;
}

export default async function BorrowingsPage() {
  const borrowings = await getBorrowings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Borrowings</h1>
        <p className="text-gray-600">Track book borrowings and returns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Borrowings</CardTitle>
          <CardDescription>Latest borrowing activities</CardDescription>
        </CardHeader>
        <CardContent>
          {borrowings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BookMarked className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">No borrowing records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowings.map((borrowing) => (
                <div
                  key={borrowing.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{borrowing.book.title}</p>
                    <p className="text-sm text-gray-500">by {borrowing.book.author}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Borrowed by: {borrowing.member.firstName} {borrowing.member.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {borrowing.member.user.email}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        borrowing.status === 'RETURNED'
                          ? 'secondary'
                          : borrowing.status === 'OVERDUE'
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {borrowing.status}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Borrowed: {format(new Date(borrowing.borrowDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(borrowing.dueDate), 'MMM d, yyyy')}
                    </p>
                    {borrowing.returnDate && (
                      <p className="text-xs text-gray-500">
                        Returned: {format(new Date(borrowing.returnDate), 'MMM d, yyyy')}
                      </p>
                    )}
                    {borrowing.fine > 0 && (
                      <p className="text-xs font-medium text-red-600">
                        Fine: ${borrowing.fine.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
