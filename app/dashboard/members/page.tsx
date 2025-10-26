import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import prisma from '@/lib/prisma';

async function getMembers() {
  const members = await prisma.member.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return members;
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-gray-600">Manage library members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>Recently registered members</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">No members found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                    {member.phone && (
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Status: {member.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      Member since: {new Date(member.membershipDate).toLocaleDateString()}
                    </p>
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
