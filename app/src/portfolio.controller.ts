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

@Controller('/portfolio')
export class PortfolioController {
    constructor(
        private readonly portfolioService: PortfolioService,
        private userService: UserService,
    ) {}

    @UseGuards(AuthGuard)
    @Post()
    async createNewPortfolio(@Req() request: Request) {
        if (!request.body.name) {
            throw new BadRequestException('Name should be provided.');
        }

        const user = await this.userService.getCurrenUser(request);

        const result = this.portfolioService.createPortfolio({
            name: request.body.name,
            userId: user.id,
            wallets: request.body.wallets,
        });

        return result;
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
