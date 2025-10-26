import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
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
        <h1 className="text-2xl sm:text-3xl font-bold">Members</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage library members</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>Recently registered members</CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No members found</p>
              <p className="text-sm text-gray-400">New members will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <Badge variant={member.status === 'ACTIVE' ? 'default' : member.status === 'SUSPENDED' ? 'destructive' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{member.user.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>Since {new Date(member.membershipDate).toLocaleDateString()}</span>
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
