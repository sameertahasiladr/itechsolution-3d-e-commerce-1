import { db } from '@/db';
import { adminUsers } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const sampleAdminUsers = [
        {
            username: 'admin',
            password: bcrypt.hashSync('admin123', 10),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(adminUsers).values(sampleAdminUsers);
    
    console.log('✅ Admin users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});