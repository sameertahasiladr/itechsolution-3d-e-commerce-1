import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';

async function main() {
    const baseDate = new Date('2024-12-15');
    
    // Order 1 - Pending
    const order1CreatedAt = new Date(baseDate.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString();
    const order1 = await db.insert(orders).values({
        customerName: 'Raj Kumar',
        customerPhone: '9876543210',
        customerEmail: 'raj.kumar@gmail.com',
        total: 102000,
        status: 'pending',
        createdAt: order1CreatedAt,
        updatedAt: order1CreatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order1[0].id,
            productId: '1',
            productName: 'Dell XPS 15',
            productPrice: 85000,
            quantity: 1,
            createdAt: order1CreatedAt,
        },
        {
            orderId: order1[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 2,
            createdAt: order1CreatedAt,
        }
    ]);

    // Order 2 - Pending
    const order2CreatedAt = new Date(baseDate.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString();
    const order2 = await db.insert(orders).values({
        customerName: 'Priya Sharma',
        customerPhone: '8765432109',
        customerEmail: 'priya.sharma@yahoo.com',
        total: 48500,
        status: 'pending',
        createdAt: order2CreatedAt,
        updatedAt: order2CreatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order2[0].id,
            productId: '3',
            productName: 'HP Pavilion Gaming',
            productPrice: 45000,
            quantity: 1,
            createdAt: order2CreatedAt,
        },
        {
            orderId: order2[0].id,
            productId: '7',
            productName: 'Samsung 27" Monitor',
            productPrice: 3500,
            quantity: 1,
            createdAt: order2CreatedAt,
        }
    ]);

    // Order 3 - Pending
    const order3CreatedAt = new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const order3 = await db.insert(orders).values({
        customerName: 'Amit Patel',
        customerPhone: '9988776655',
        customerEmail: null,
        total: 37000,
        status: 'pending',
        createdAt: order3CreatedAt,
        updatedAt: order3CreatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order3[0].id,
            productId: '2',
            productName: 'MacBook Air M1',
            productPrice: 25000,
            quantity: 1,
            createdAt: order3CreatedAt,
        },
        {
            orderId: order3[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 1,
            createdAt: order3CreatedAt,
        },
        {
            orderId: order3[0].id,
            productId: '7',
            productName: 'Samsung 27" Monitor',
            productPrice: 3500,
            quantity: 1,
            createdAt: order3CreatedAt,
        }
    ]);

    // Order 4 - Confirmed
    const order4CreatedAt = new Date(baseDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString();
    const order4UpdatedAt = new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
    const order4 = await db.insert(orders).values({
        customerName: 'Sneha Reddy',
        customerPhone: '9123456789',
        customerEmail: 'sneha.reddy@hotmail.com',
        total: 93500,
        status: 'confirmed',
        createdAt: order4CreatedAt,
        updatedAt: order4UpdatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order4[0].id,
            productId: '1',
            productName: 'Dell XPS 15',
            productPrice: 85000,
            quantity: 1,
            createdAt: order4CreatedAt,
        },
        {
            orderId: order4[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 1,
            createdAt: order4CreatedAt,
        }
    ]);

    // Order 5 - Confirmed
    const order5CreatedAt = new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const order5UpdatedAt = new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
    const order5 = await db.insert(orders).values({
        customerName: 'Vikram Singh',
        customerPhone: '8899001122',
        customerEmail: 'vikram.singh@gmail.com',
        total: 78000,
        status: 'confirmed',
        createdAt: order5CreatedAt,
        updatedAt: order5UpdatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order5[0].id,
            productId: '3',
            productName: 'HP Pavilion Gaming',
            productPrice: 45000,
            quantity: 1,
            createdAt: order5CreatedAt,
        },
        {
            orderId: order5[0].id,
            productId: '2',
            productName: 'MacBook Air M1',
            productPrice: 25000,
            quantity: 1,
            createdAt: order5CreatedAt,
        },
        {
            orderId: order5[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 1,
            createdAt: order5CreatedAt,
        }
    ]);

    // Order 6 - Confirmed
    const order6CreatedAt = new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const order6UpdatedAt = new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const order6 = await db.insert(orders).values({
        customerName: 'Ananya Gupta',
        customerPhone: '9876501234',
        customerEmail: null,
        total: 28000,
        status: 'confirmed',
        createdAt: order6CreatedAt,
        updatedAt: order6UpdatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order6[0].id,
            productId: '2',
            productName: 'MacBook Air M1',
            productPrice: 25000,
            quantity: 1,
            createdAt: order6CreatedAt,
        },
        {
            orderId: order6[0].id,
            productId: '7',
            productName: 'Samsung 27" Monitor',
            productPrice: 3500,
            quantity: 1,
            createdAt: order6CreatedAt,
        }
    ]);

    // Order 7 - Completed
    const order7CreatedAt = new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString();
    const order7UpdatedAt = new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
    const order7 = await db.insert(orders).values({
        customerName: 'Karthik Iyer',
        customerPhone: '9445566778',
        customerEmail: 'karthik.iyer@outlook.com',
        total: 110000,
        status: 'completed',
        createdAt: order7CreatedAt,
        updatedAt: order7UpdatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order7[0].id,
            productId: '1',
            productName: 'Dell XPS 15',
            productPrice: 85000,
            quantity: 1,
            createdAt: order7CreatedAt,
        },
        {
            orderId: order7[0].id,
            productId: '2',
            productName: 'MacBook Air M1',
            productPrice: 25000,
            quantity: 1,
            createdAt: order7CreatedAt,
        }
    ]);

    // Order 8 - Completed
    const order8CreatedAt = new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const order8UpdatedAt = new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString();
    const order8 = await db.insert(orders).values({
        customerName: 'Meera Nair',
        customerPhone: '8765098765',
        customerEmail: 'meera.nair@gmail.com',
        total: 61500,
        status: 'completed',
        createdAt: order8CreatedAt,
        updatedAt: order8UpdatedAt,
    }).returning();

    await db.insert(orderItems).values([
        {
            orderId: order8[0].id,
            productId: '3',
            productName: 'HP Pavilion Gaming',
            productPrice: 45000,
            quantity: 1,
            createdAt: order8CreatedAt,
        },
        {
            orderId: order8[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 1,
            createdAt: order8CreatedAt,
        },
        {
            orderId: order8[0].id,
            productId: '5',
            productName: 'Logitech MX Master 3',
            productPrice: 8500,
            quantity: 1,
            createdAt: order8CreatedAt,
        }
    ]);

    console.log('✅ Orders and order items seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});