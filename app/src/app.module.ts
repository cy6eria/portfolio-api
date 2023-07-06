import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PortfolioController } from './portfolio.controller';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';
import { PortfolioService } from './portfolio.service';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [PortfolioController, BlockchainController],
    providers: [
        PortfolioService,
        PrismaService,
        UserService,
        BlockchainService,
    ],
})
export class AppModule {}
