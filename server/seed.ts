import { db } from './db';
import { hashPassword } from './auth';
import { users, chatRooms } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    const userCount = await db
      .select({ count: { value: users.id } })
      .from(users)
      .catch((err) => {
        console.error('Error checking user count (table may not exist):', err);
        return [];
      });

    if (userCount.length > 0 && userCount[0].count && userCount[0].count.value > 0) {
      console.log('Database already has users, skipping seed');
      return;
    }
    
    const hashedPassword = await hashPassword('password');
    
    const [admin] = await db
      .insert(users)
      .values([
        { username: 'admin', email: 'admin@example.com', password: hashedPassword, isAdmin: true },
        { username: 'leon', email: 'leon@example.com', password: hashedPassword, isAdmin: true },
        { username: 'aaronleon', email: 'aaronleon@example.com', password: hashedPassword, isAdmin: true },
        { username: 'john', email: 'john@example.com', password: hashedPassword, isAdmin: false },
      ])
      .returning();

    await db.insert(chatRooms).values([
      { name: 'General', description: 'General discussion for all topics', createdById: admin.id, isPrivate: false },
      { name: 'Poetry', description: 'Share and discuss poetry', createdById: admin.id, isPrivate: false },
      { name: 'Book Club', description: 'Discuss books and literature', createdById: admin.id, isPrivate: false },
      { name: 'Events', description: 'Upcoming literary events and meetups', createdById: admin.id, isPrivate: false },
    ]);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}