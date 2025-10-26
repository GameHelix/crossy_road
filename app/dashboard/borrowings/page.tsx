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
        <h1 className="text-2xl sm:text-3xl font-bold">Borrowings</h1>
        <p className="text-sm sm:text-base text-gray-600">Track book borrowings and returns</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Borrowings</CardTitle>
          <CardDescription>Latest borrowing activities</CardDescription>
        </CardHeader>
        <CardContent>
          {borrowings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <BookMarked className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No borrowing records found</p>
              <p className="text-sm text-gray-400">Borrowing history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowings.map((borrowing) => (
                <Card
                  key={borrowing.id}
                  className="hover:shadow-md transition-shadow border-l-4"
                  style={{
                    borderLeftColor:
                      borrowing.status === 'RETURNED'
                        ? '#10b981'
                        : borrowing.status === 'OVERDUE'
                        ? '#ef4444'
                        : '#3b82f6',
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="font-semibold text-lg text-gray-900">{borrowing.book.title}</p>
                          <p className="text-sm text-gray-600">by {borrowing.book.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                            {borrowing.member.firstName[0]}{borrowing.member.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {borrowing.member.firstName} {borrowing.member.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {borrowing.member.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge
                          className="text-xs"
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
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <span className="font-medium">Borrowed:</span> {format(new Date(borrowing.borrowDate), 'MMM d, yyyy')}
                          </p>
                          <p>
                            <span className="font-medium">Due:</span> {format(new Date(borrowing.dueDate), 'MMM d, yyyy')}
                          </p>
                          {borrowing.returnDate && (
                            <p>
                              <span className="font-medium">Returned:</span> {format(new Date(borrowing.returnDate), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        {borrowing.fine > 0 && (
                          <div className="px-2 py-1 bg-red-50 rounded text-xs font-semibold text-red-600">
                            Fine: ${borrowing.fine.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
