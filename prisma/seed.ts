import { PrismaClient, Role, MemberStatus, BorrowStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️  Cleaning existing data...')
  await prisma.borrowing.deleteMany()
  await prisma.book.deleteMany()
  await prisma.member.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@libra.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: Role.ADMIN,
    },
  })

  // Create Librarian User
  console.log('👤 Creating librarian user...')
  const librarianUser = await prisma.user.create({
    data: {
      email: 'librarian@libra.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: Role.LIBRARIAN,
    },
  })

  // Create Member Users
  console.log('👤 Creating member users...')
  const memberUser1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: Role.MEMBER,
      member: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1-555-0101',
          address: '123 Main St, New York, NY 10001',
          membershipDate: new Date('2024-01-15'),
          status: MemberStatus.ACTIVE,
        },
      },
    },
    include: {
      member: true,
    },
  })

  const memberUser2 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@example.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: Role.MEMBER,
      member: {
        create: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          phone: '+1-555-0102',
          address: '456 Oak Ave, Los Angeles, CA 90001',
          membershipDate: new Date('2024-02-20'),
          status: MemberStatus.ACTIVE,
        },
      },
    },
    include: {
      member: true,
    },
  })

  const memberUser3 = await prisma.user.create({
    data: {
      email: 'mike.wilson@example.com',
      password: hashedPassword,
      name: 'Mike Wilson',
      role: Role.MEMBER,
      member: {
        create: {
          firstName: 'Mike',
          lastName: 'Wilson',
          phone: '+1-555-0103',
          address: '789 Pine Rd, Chicago, IL 60601',
          membershipDate: new Date('2024-03-10'),
          status: MemberStatus.SUSPENDED,
        },
      },
    },
    include: {
      member: true,
    },
  })

  // Create Books
  console.log('📚 Creating books...')
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        publisher: 'Scribner',
        publishedYear: 1925,
        category: 'Classic Fiction',
        description: 'A novel set in the Jazz Age that tells the story of Jay Gatsby and his love for Daisy Buchanan.',
        quantity: 5,
        available: 3,
        imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        publisher: 'J.B. Lippincott & Co.',
        publishedYear: 1960,
        category: 'Classic Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
        quantity: 4,
        available: 2,
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0-452-28423-4',
        publisher: 'Secker & Warburg',
        publishedYear: 1949,
        category: 'Dystopian Fiction',
        description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
        quantity: 6,
        available: 4,
        imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        isbn: '978-0-316-76948-0',
        publisher: 'Little, Brown and Company',
        publishedYear: 1951,
        category: 'Coming-of-age Fiction',
        description: 'The story of teenage rebellion and alienation narrated by Holden Caulfield.',
        quantity: 3,
        available: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        isbn: '978-0-14-143951-8',
        publisher: 'T. Egerton',
        publishedYear: 1813,
        category: 'Romance',
        description: 'A romantic novel of manners that follows Elizabeth Bennet and Mr. Darcy.',
        quantity: 4,
        available: 4,
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '978-0-547-92822-7',
        publisher: 'George Allen & Unwin',
        publishedYear: 1937,
        category: 'Fantasy',
        description: 'The adventures of hobbit Bilbo Baggins as he journeys to the Lonely Mountain.',
        quantity: 5,
        available: 3,
        imageUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        category: 'Technology',
        description: 'A handbook of agile software craftsmanship with best practices for writing clean code.',
        quantity: 3,
        available: 2,
        imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-0-06-231609-7',
        publisher: 'Harper',
        publishedYear: 2011,
        category: 'Non-Fiction',
        description: 'A brief history of humankind from the Stone Age to the modern age.',
        quantity: 4,
        available: 3,
        imageUrl: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400',
      },
    }),
  ])

  // Create Borrowings
  console.log('📖 Creating borrowings...')

  // Active borrowing - John Doe borrowed The Great Gatsby
  await prisma.borrowing.create({
    data: {
      memberId: memberUser1.member!.id,
      bookId: books[0].id,
      borrowDate: new Date('2024-10-01'),
      dueDate: new Date('2024-10-15'),
      status: BorrowStatus.BORROWED,
      fine: 0,
    },
  })

  // Active borrowing - John Doe borrowed To Kill a Mockingbird
  await prisma.borrowing.create({
    data: {
      memberId: memberUser1.member!.id,
      bookId: books[1].id,
      borrowDate: new Date('2024-10-05'),
      dueDate: new Date('2024-10-19'),
      status: BorrowStatus.BORROWED,
      fine: 0,
    },
  })

  // Overdue borrowing - Sarah Johnson borrowed The Catcher in the Rye (overdue)
  await prisma.borrowing.create({
    data: {
      memberId: memberUser2.member!.id,
      bookId: books[3].id,
      borrowDate: new Date('2024-09-15'),
      dueDate: new Date('2024-09-29'),
      status: BorrowStatus.OVERDUE,
      fine: 15.50,
      notes: 'Overdue by 27 days. Fine: $0.50/day',
    },
  })

  // Returned borrowing - Sarah Johnson returned 1984
  await prisma.borrowing.create({
    data: {
      memberId: memberUser2.member!.id,
      bookId: books[2].id,
      borrowDate: new Date('2024-09-01'),
      dueDate: new Date('2024-09-15'),
      returnDate: new Date('2024-09-14'),
      status: BorrowStatus.RETURNED,
      fine: 0,
      notes: 'Returned on time',
    },
  })

  // Active borrowing - Sarah Johnson borrowed The Hobbit
  await prisma.borrowing.create({
    data: {
      memberId: memberUser2.member!.id,
      bookId: books[5].id,
      borrowDate: new Date('2024-10-10'),
      dueDate: new Date('2024-10-24'),
      status: BorrowStatus.BORROWED,
      fine: 0,
    },
  })

  // Returned borrowing - Mike Wilson returned Clean Code (late)
  await prisma.borrowing.create({
    data: {
      memberId: memberUser3.member!.id,
      bookId: books[6].id,
      borrowDate: new Date('2024-08-01'),
      dueDate: new Date('2024-08-15'),
      returnDate: new Date('2024-08-20'),
      status: BorrowStatus.RETURNED,
      fine: 2.50,
      notes: 'Returned 5 days late. Fine paid.',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Users: ${await prisma.user.count()}`)
  console.log(`   - Members: ${await prisma.member.count()}`)
  console.log(`   - Books: ${await prisma.book.count()}`)
  console.log(`   - Borrowings: ${await prisma.borrowing.count()}`)

  console.log('\n🔐 Login Credentials:')
  console.log('   Admin:')
  console.log('     Email: admin@libra.com')
  console.log('     Password: password123')
  console.log('\n   Librarian:')
  console.log('     Email: librarian@libra.com')
  console.log('     Password: password123')
  console.log('\n   Members:')
  console.log('     Email: john.doe@example.com')
  console.log('     Password: password123')
  console.log('\n     Email: sarah.johnson@example.com')
  console.log('     Password: password123')
  console.log('\n     Email: mike.wilson@example.com (suspended)')
  console.log('     Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
