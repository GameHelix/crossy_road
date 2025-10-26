import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(1),
  publisher: z.string().optional(),
  publishedYear: z.number().int().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const books = await prisma.book.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } },
              { isbn: { contains: search, mode: 'insensitive' } },
              { category: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bookSchema.parse(body);

    // Check if ISBN already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn: validatedData.isbn },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        ...validatedData,
        available: validatedData.quantity,
      },
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
