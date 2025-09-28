<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChatRoom;
use App\Models\User;

class ChatRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user as the creator (or create one if none exists)
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'first_name' => 'System',
                'last_name' => 'Admin',
                'username' => 'system_admin',
                'email' => 'admin@versefountain.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        $chatrooms = [
            [
                'name' => 'Poetry Enthusiasts',
                'description' => 'Share and discuss your favorite poems, discover new voices, and explore different poetic styles from around the world.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Writing Workshop',
                'description' => 'Get constructive feedback on your writing, share techniques, and improve your craft with fellow writers.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Book Club',
                'description' => 'Discuss your favorite books, share recommendations, and explore literature from various genres and time periods.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'General Discussion',
                'description' => 'General poetry and writing discussions, community announcements, and casual conversations about the literary world.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Poetry Critique',
                'description' => 'Get detailed, constructive feedback on your poems. Share your work and help others improve their poetry.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Haiku Corner',
                'description' => 'Share and discuss haiku poetry, explore the beauty of minimalism, and practice the art of brevity.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Spoken Word',
                'description' => 'For poets who perform their work. Share videos, discuss performance techniques, and celebrate the oral tradition of poetry.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Poetry Challenges',
                'description' => 'Participate in writing challenges, prompts, and contests. Push your creative boundaries and inspire others.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Classic Poetry',
                'description' => 'Explore and discuss classic poetry from masters like Shakespeare, Dickinson, Frost, and other legendary poets.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Modern Poetry',
                'description' => 'Contemporary poetry discussions, emerging poets, and modern poetic movements and trends.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Poetry Translation',
                'description' => 'Share translated poems, discuss translation challenges, and explore poetry from different languages and cultures.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ],
            [
                'name' => 'Poetry Education',
                'description' => 'Learn about poetic forms, techniques, and literary devices. Educational discussions for poets at all levels.',
                'isPrivate' => false,
                'created_by_id' => $user->id
            ]
        ];

        foreach ($chatrooms as $chatroomData) {
            ChatRoom::create($chatroomData);
        }

        $this->command->info('Created ' . count($chatrooms) . ' chatrooms');
    }
}