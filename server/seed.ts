import { db } from './db';
import { hashPassword } from './auth';
import { users, chatRooms, events } from '@shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

export async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    // Check if we already have users
    const userCount = await db.select({ count: { value: users.id } }).from(users);
    if (userCount.length > 0 && userCount[0].count && userCount[0].count.value > 0) {
      console.log('Database already has users, skipping seed');
      return;
    }
    
    // Create admin user
    const hashedPassword = await hashPassword('password');
    
    // Insert admin user
    const [admin] = await db.insert(users).values({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true
    }).returning();

    // Insert regular users
    await db.insert(users).values([
      {
        username: 'leon',
        email: 'leon@example.com',
        password: hashedPassword,
        isAdmin: true
      },
      {
        username: 'aaronleon',
        email: 'aaronleon@example.com',
        password: hashedPassword,
        isAdmin: true
      },
      {
        username: 'john',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false
      }
    ]);
    
    // Create default chat rooms
    await db.insert(chatRooms).values([
      {
        name: 'General',
        description: 'General discussion for all topics',
        createdById: admin.id,
        isPrivate: false
      },
      {
        name: 'Poetry',
        description: 'Share and discuss poetry',
        createdById: admin.id,
        isPrivate: false
      },
      {
        name: 'Book Club',
        description: 'Discuss books and literature',
        createdById: admin.id,
        isPrivate: false
      },
      {
        name: 'Events',
        description: 'Upcoming literary events and meetups',
        createdById: admin.id,
        isPrivate: false
      }
    ]);
    
    // Import events from events.json if available
    try {
      const eventsJsonPath = path.resolve(process.cwd(), 'events.json');
      if (fs.existsSync(eventsJsonPath)) {
        console.log('Found events.json file, importing events...');
        const eventsData = JSON.parse(fs.readFileSync(eventsJsonPath, 'utf8'));
        
        // Check if we already have events in the database
        const eventCount = await db.select({ count: { value: events.id } }).from(events);
        if (eventCount.length > 0 && eventCount[0].count && eventCount[0].count.value === 0) {
          console.log(`Importing ${eventsData.length} events from events.json...`);
          
          // Map events.json data to match database schema
          const eventsToInsert = eventsData.map(event => {
            return {
              title: event.title,
              description: event.description,
              date: new Date(event.date),
              location: event.location,
              ticketPrice: event.ticketPrice,
              organizer: event.organizer,
              isVirtual: event.isVirtual,
              streamUrl: event.streamUrl,
              isFree: event.isFree,
              createdById: event.createdById || admin.id, // Default to admin if not specified
              category: event.category || 'general'
            };
          });
          
          await db.insert(events).values(eventsToInsert);
          console.log('Events imported successfully');
        } else {
          console.log('Database already has events, skipping import');
        }
      } else {
        console.log('No events.json file found, skipping event import');
      }
    } catch (eventImportError) {
      console.error('Error importing events:', eventImportError);
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}