import {
    UseGuards,
    Controller,
    Get,
    Post,
    Delete,
    Req,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { PortfolioService } from './portfolio.service';
import { UserService } from './user.service';
import { EtherscanService } from './etherscan.service';
import { BlockchainService } from './blockchain.service';

@Controller('/portfolio')
export class PortfolioController {
    constructor(
        private readonly portfolioService: PortfolioService,
        private readonly userService: UserService,
        private readonly etherscanService: EtherscanService,
        private readonly blockchainService: BlockchainService,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    async createNewPortfolio(@Req() request: Request) {
        if (!request.body.name) {
            throw new BadRequestException('Name should be provided.');
        }

        const user = await this.userService.getCurrenUser(request);

        const blockchains = await this.blockchainService.getBlockchains();

        const blockchainsMap = new Map(blockchains.map((b) => [b.id, b.name]));

        const problems = [];

        for (const wallet of request.body.wallets) {
            const blockchain = blockchainsMap.get(wallet.blockchainId);

            switch (blockchain) {
                case 'ethereum': {
                    try {
                        const transactions =
                            await this.etherscanService.getTransactions(
                                wallet.address,
                            );

                        console.log(
                            `transactions for ${wallet.address}`,
                            transactions,
                        );

                        wallet.transactions = transactions;
                    } catch (err) {
                        problems.push(
                            `Can\`t get transactions for ${wallet.address}`,
                        );
                    }
                    break;
                }
                default: {
                    problems.push(
                        `Can\`t find blockchain with id ${wallet.blockchainId}`,
                    );
                }
            }
        }

        const result = this.portfolioService.createPortfolio({
            name: request.body.name,
            userId: user.id,
            wallets: request.body.wallets,
        });

        return { problems, ...result };
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deletePortfolio(@Param('id') id: string, @Req() request: Request) {
        const user = await this.userService.getCurrenUser(request);

        return this.portfolioService.deletePortfolio({ id, userId: user.id });
    }

    @UseGuards(AuthGuard)
    @Get()
    async getPortfolios(@Req() request: Request) {
        const user = await this.userService.getCurrenUser(request);

        const data = this.portfolioService.getPortfolios({ userId: user.id });

        return data;
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Req() request: Request) {
        const user = await this.userService.getCurrenUser(request);

        return this.portfolioService.getPortfolio({ id, userId: user.id });
    }
}
