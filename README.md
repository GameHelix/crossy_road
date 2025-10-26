# Libra - Library Management System

A modern library management system built with Next.js 16, Prisma ORM, and Neon PostgreSQL. Libra provides comprehensive features for managing books, members, and borrowing operations with role-based access control.

## Screenshots

### Landing Page
![Landing Page](./screenshots/landing%20page.png)
*Modern, responsive landing page with call-to-action buttons and feature highlights*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin%20dashboard.png)
*Comprehensive dashboard with statistics cards showing total books, members, active borrowings, and overdue books*

### Book Management
![Books](./screenshots/books.png)
*Full CRUD interface for managing the book catalog with search functionality*

### Members
![Members](./screenshots/members.png)
*Member management interface showing member profiles and status*

### Borrowings
![Borrowings](./screenshots/borrowings.png)
*Track all borrowing records with status indicators and fine calculations*

## Features

- **Role-Based Access Control**: Three distinct user roles (Admin, Librarian, Member)
- **Book Management**: Complete CRUD operations for books with categories and availability tracking
- **Member Management**: Track member information, status, and borrowing history
- **Borrowing System**: Manage book checkouts, returns, and overdue tracking with fines
- **Authentication**: Secure authentication using NextAuth.js v5
- **Modern UI**: Responsive design with Tailwind CSS and Radix UI components
- **Serverless Database**: Powered by Neon PostgreSQL with connection pooling

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma with Neon adapter
- **UI Components**: Radix UI, Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel

## User Roles & Permissions

### Admin
The system administrator with full access to all features.

**Capabilities:**
- ✅ Full access to all system features
- ✅ Manage users (create, update, delete, change roles)
- ✅ Manage all books (add, edit, delete)
- ✅ Manage all members (view, create, update, suspend)
- ✅ Process all borrowing operations
- ✅ View system-wide statistics and reports
- ✅ Configure system settings

**User Flow:**
1. Log in with admin credentials
2. Access admin dashboard with full navigation
3. Manage users, books, members, and borrowings
4. View analytics and reports
5. Configure system settings

### Librarian
Staff member responsible for day-to-day library operations.

**Capabilities:**
- ✅ Manage books (add, edit, update availability)
- ✅ Manage members (view, create, update status)
- ✅ Process borrowing operations (checkout, return)
- ✅ Calculate and record fines
- ✅ View borrowing history and statistics
- ❌ Cannot manage users or change roles
- ❌ Cannot delete books or members

**User Flow:**
1. Log in with librarian credentials
2. Access librarian dashboard
3. Check out books to members
4. Process book returns
5. Update member statuses
6. Add new books to inventory
7. View borrowing statistics

### Member
Library patron who can borrow books.

**Capabilities:**
- ✅ View available books and browse catalog
- ✅ View personal borrowing history
- ✅ View current borrowed books
- ✅ View personal fines and dues
- ✅ Update personal profile information
- ❌ Cannot access administrative features
- ❌ Cannot view other members' information

**User Flow:**
1. Register for an account or log in
2. Browse available books
3. Request books (librarian processes)
4. View borrowed books and due dates
5. Check fines and borrowing history
6. Update profile information

## Database Schema

### User
Stores authentication and role information.
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String
  role          Role      @default(MEMBER)
  member        Member?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Member
Extended profile for library members.
```prisma
model Member {
  id             String        @id @default(cuid())
  userId         String        @unique
  user           User          @relation(...)
  firstName      String
  lastName       String
  phone          String?
  address        String?
  membershipDate DateTime      @default(now())
  status         MemberStatus  @default(ACTIVE)
  borrowings     Borrowing[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

### Book
Book inventory and availability tracking.
```prisma
model Book {
  id            String      @id @default(cuid())
  title         String
  author        String
  isbn          String      @unique
  publisher     String?
  publishedYear Int?
  category      String?
  description   String?
  quantity      Int         @default(1)
  available     Int         @default(1)
  imageUrl      String?
  borrowings    Borrowing[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

### Borrowing
Tracks book checkouts and returns.
```prisma
model Borrowing {
  id         String       @id @default(cuid())
  memberId   String
  member     Member       @relation(...)
  bookId     String
  book       Book         @relation(...)
  borrowDate DateTime     @default(now())
  dueDate    DateTime
  returnDate DateTime?
  status     BorrowStatus @default(BORROWED)
  fine       Float        @default(0)
  notes      String?
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}
```

### Enums
```prisma
enum Role {
  ADMIN
  LIBRARIAN
  MEMBER
}

enum MemberStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum BorrowStatus {
  BORROWED
  RETURNED
  OVERDUE
}
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd libra
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-name-pooler.region.aws.neon.tech/dbname?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database with example data
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## Seeding the Database

The seed script creates example data for testing:

```bash
npm run db:seed
```

### Sample Accounts Created:

**Admin Account:**
- Email: `admin@libra.com`
- Password: `password123`
- Role: ADMIN

**Librarian Account:**
- Email: `librarian@libra.com`
- Password: `password123`
- Role: LIBRARIAN

**Member Accounts:**
- Email: `john.doe@example.com` - Password: `password123` (Active)
- Email: `sarah.johnson@example.com` - Password: `password123` (Active)
- Email: `mike.wilson@example.com` - Password: `password123` (Suspended)

**Books Created:**
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- The Catcher in the Rye
- Pride and Prejudice
- The Hobbit
- Clean Code
- Sapiens

**Borrowings Created:**
- Active borrowings
- Overdue borrowings with fines
- Returned borrowings

## Creating an Admin Account

### Method 1: Using the Seed Script
The easiest way is to use the seed script which creates an admin account automatically:

```bash
npm run db:seed
```

Then log in with:
- Email: `admin@libra.com`
- Password: `password123`

### Method 2: Manual Database Update
If you already have a user account and want to make it an admin:

1. **Using Prisma Studio:**
```bash
npx prisma studio
```
- Navigate to the `User` model
- Find your user
- Change the `role` field to `ADMIN`
- Save

2. **Using SQL:**
```sql
UPDATE "libra"."users"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

### Method 3: Create via Code
Add this temporary API route at `/app/api/create-admin/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  const hashedPassword = await bcrypt.hash('your-password', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@yourdomain.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  return NextResponse.json({ success: true, admin })
}
```

Visit `/api/create-admin` once, then delete the file.

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel
- Go to [Vercel](https://vercel.com)
- Import your repository
- Configure the project

### 3. Add Environment Variables
In Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@ep-name-pooler.region.aws.neon.tech/dbname?sslmode=require
NEXTAUTH_SECRET=<your-secret-key>
NEXTAUTH_URL=https://your-app.vercel.app
```

**Important:**
- Use the pooled connection string from Neon (with `-pooler` in the hostname)
- Add environment variables for Production, Preview, and Development
- Generate a new NEXTAUTH_SECRET for production

### 4. Deploy
Vercel will automatically deploy your application.

### 5. Seed Production Database
After deployment, seed your production database:

```bash
# Option 1: Run locally against production DB
DATABASE_URL="your-production-url" npm run db:seed

# Option 2: Create a temporary API route (see Method 3 above)
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma migrate dev        # Create and apply migrations
npx prisma migrate deploy     # Apply migrations (production)
npx prisma generate          # Generate Prisma Client
npx prisma studio           # Open Prisma Studio
npm run db:seed            # Seed database with example data
npm run db:reset          # Reset database and re-seed

# Code Quality
npm run lint         # Run ESLint
```

## Project Structure

```
libra/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth.js routes
│   │   └── ...           # Other API endpoints
│   ├── dashboard/        # Dashboard pages
│   ├── books/           # Book management
│   ├── members/        # Member management
│   ├── borrowings/    # Borrowing operations
│   └── ...
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   └── ...
├── lib/              # Utility functions
│   ├── prisma.ts    # Prisma client
│   └── auth.ts     # Auth configuration
├── prisma/
│   ├── schema.prisma  # Database schema
│   ├── seed.ts       # Seed script
│   └── migrations/  # Database migrations
└── public/        # Static assets
```

## Key Features Explained

### Authentication Flow
1. User registers or logs in via `/login` or `/register`
2. NextAuth.js validates credentials
3. Session is created with user role
4. Middleware protects routes based on role
5. Client can access user session via `useSession()`

### Borrowing Workflow
1. **Checkout:**
   - Librarian/Admin selects member and book
   - System checks book availability
   - Creates borrowing record
   - Decrements available count
   - Sets due date (typically 14 days)

2. **Return:**
   - Librarian/Admin processes return
   - System checks if overdue
   - Calculates fine if applicable
   - Updates borrowing status
   - Increments available count

3. **Overdue Handling:**
   - System identifies overdue books
   - Calculates fines (e.g., $0.50/day)
   - Updates borrowing status to OVERDUE
   - Displays in member and librarian dashboards

### Fine Calculation
```typescript
const daysOverdue = Math.floor(
  (new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
)
const fine = daysOverdue * 0.50 // $0.50 per day
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct and uses pooled connection (`-pooler`)
- Check Neon database is not suspended
- Ensure `.env` file is in root directory

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear cookies and try again

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database
npm run db:reset
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Email: support@libra.com

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Neon](https://neon.tech/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
