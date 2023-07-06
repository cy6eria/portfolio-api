import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BlockchainService {
    constructor(private prisma: PrismaService) {}

    async getBlockchains() {
        return this.prisma.blockchain.findMany();
    }
}
