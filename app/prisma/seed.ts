import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const bitcoin = await prisma.blockchain.create({
        data: {
            name: 'bitcoin',
        },
    });

    const ethereum = await prisma.blockchain.create({
        data: {
            name: 'ethereum',
        },
    });

    console.log({ bitcoin, ethereum });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
