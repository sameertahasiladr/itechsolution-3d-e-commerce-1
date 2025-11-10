import { db } from '@/db';
import { user, account } from '@/db/schema';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function main() {
    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const now = new Date();

    const adminUser = {
        id: userId,
        name: 'Admin',
        email: 'admin@itechsolution.com',
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
    };

    const adminAccount = {
        id: accountId,
        accountId: 'admin@itechsolution.com',
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: now,
        updatedAt: now,
    };

    await db.insert(user).values(adminUser);
    await db.insert(account).values(adminAccount);
    
    console.log('✅ Admin user seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});