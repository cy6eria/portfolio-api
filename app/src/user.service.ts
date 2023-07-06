import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Clerk } from '@clerk/backend';
import { decodeJwt } from '@clerk/backend';

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class UserService {
    async getCurrenUser(request: Request) {
        const token = (request.headers.authorization ?? '').replace('Bearer ', '');

        if (!token) {
            return null;
        }

        const { payload } = decodeJwt(token);

        let user = null;

        try {
            user = await clerk.users.getUser(payload.sub);
        } catch (err) {
            user = null;
        }

        return user;
    }
}
