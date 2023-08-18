import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PortfolioService {
    constructor(private prisma: PrismaService) {}

    async createPortfolio(data) {
        return this.prisma.portfolio.create({
            data: {
                name: data.name,
                userId: data.userId,
                wallets: {
                    create: (data.wallets ?? []).map((wallet) => ({
                        address: wallet.address,
                        blockchain: {
                            connect: {
                                id: wallet.blockchainId,
                            },
                        },
                        transactions: {
                            create: wallet.transactions,
                        },
                    })),
                },
            },
            include: {
                wallets: {
                    include: {
                        blockchain: true,
                        transactions: true,
                    },
                },
            },
        });
    }

    async deletePortfolio({ id, userId }: { userId: string; id: string }) {
        return this.prisma.portfolio.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }

    async getPortfolios(params: { userId: string }) {
        return this.prisma.portfolio.findMany({
            where: {
                userId: params.userId,
            },
        });
    }

    async getPortfolio(params: { userId: string; id: string }) {
        const { id, userId } = params;

        const data = this.prisma.portfolio.findMany({
            where: {
                id,
                userId,
            },
        });

        return data?.[0] ?? null;
    }
}
