# Libra - Library Management System

A modern, full-stack library management system built with Next.js 16, TypeScript, Prisma, and Neon PostgreSQL.

## Features

- **Authentication & Authorization**: Secure user authentication with NextAuth.js
- **Book Management**: Complete CRUD operations for managing book catalog
- **Member Management**: Track library members and their information
- **Borrowing System**: Track book checkouts, returns, and due dates
- **Dashboard**: Overview statistics and recent activities
- **Search & Filter**: Quick search across books by title, author, ISBN, and category
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL (using `libra` schema)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Form Validation**: Zod
- **Deployment**: Vercel

## Database Schema

The application uses a **`libra`** schema in PostgreSQL with the following models:

- **User**: Authentication and user information
- **Member**: Library member details
- **Book**: Book catalog with availability tracking
- **Borrowing**: Book checkout and return records

All tables are created in the `libra` schema in your Neon PostgreSQL database.

### User Roles

- **ADMIN**: Full system access
- **LIBRARIAN**: Manage books and borrowings
- **MEMBER**: View catalog and personal borrowings

## Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database (or any PostgreSQL database)

## Environment Variables

The `.env` file is already configured with your Neon PostgreSQL connection:

```env
DATABASE_URL=postgresql://tg_db_owner:...@ep-frosty-voice-a2s9itd4-pooler.eu-central-1.aws.neon.tech/tg_db?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Getting Started

The project is already set up and running! Here's what's been done:

1. **Dependencies installed** ✓
2. **Database configured** ✓ (using `libra` schema in Neon)
3. **Migrations run** ✓
4. **Development server running** ✓ at `http://localhost:3002`

### To start developing:

1. **Register a new account** at `http://localhost:3002/register`
2. **Login** with your credentials
3. **Access the dashboard** to start managing your library

## Usage

### Managing Books

1. Navigate to **Books** from the sidebar
2. Click **Add Book** to add a new book to the catalog
3. Use the search bar to find books by title, author, ISBN, or category
4. Click **Edit** to update book information
5. Click **Delete** to remove a book (only if no active borrowings)

### Managing Members

- Navigate to **Members** to view all registered members
- View member details including contact information and membership status

### Managing Borrowings

- Navigate to **Borrowings** to view all borrowing records
- Track active borrowings, due dates, and overdue books
- View return history

## Project Structure

```
libra/
├── app/
│   ├── api/                # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── books/         # Books CRUD endpoints
│   ├── dashboard/         # Dashboard pages
│   │   ├── books/        # Books management (full CRUD)
│   │   ├── members/      # Members management
│   │   └── borrowings/   # Borrowings management
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Home page (redirects)
├── components/
│   ├── ui/               # shadcn/ui components
│   └── sidebar.tsx       # Navigation sidebar
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── actions.ts        # Server actions
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema (libra schema)
│   └── migrations/       # Database migrations
├── auth.ts               # NextAuth configuration
├── auth.config.ts        # NextAuth config
└── middleware.ts         # Route protection
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Books
- `GET /api/books` - Get all books (with optional search)
- `POST /api/books` - Create a new book
- `GET /api/books/[id]` - Get book by ID
- `PUT /api/books/[id]` - Update book
- `DELETE /api/books/[id]` - Delete book

## Database Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

## Development

```bash
# Start development server (already running!)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository

3. **Set environment variables** in Vercel:
   - `DATABASE_URL` (your Neon PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (generate a secure random string)
   - `NEXTAUTH_URL` (your production URL, e.g., https://libra.vercel.app)

4. **Deploy**: Vercel will automatically deploy your application

### Post-Deployment

After deploying, ensure migrations are applied:
```bash
npx prisma migrate deploy
```

## What's Working

✅ Authentication (Login/Register)
✅ Dashboard with statistics
✅ Books management (full CRUD)
✅ Members list
✅ Borrowings list
✅ Search functionality
✅ Responsive design

## Future Enhancements

- [ ] Complete Members CRUD operations
- [ ] Borrowing/Return functionality with due date tracking
- [ ] Fine calculation system
- [ ] Email notifications for due dates
- [ ] Book recommendations
- [ ] Advanced reporting and analytics
- [ ] Barcode scanning
- [ ] Multi-library support

## License

ISC

## Database Schema Details

All models use the `libra` schema in your Neon PostgreSQL database:
- Tables: `users`, `members`, `books`, `borrowings`
- Enums: `Role`, `MemberStatus`, `BorrowStatus`

You can verify this in `prisma/schema.prisma` where each model has `@@schema("libra")`.
