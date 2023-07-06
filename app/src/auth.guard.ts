import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = (request.headers.authorization ?? '').replace('Bearer ', '');

        return new Promise(async (resolve) => {
            try {
                await verifyToken(token, {
                    issuer: 'https://special-shark-98.clerk.accounts.dev',
                    authorizedParties: ['http://localhost:3000'],
                });
                
                resolve(true);
            } catch (err) {
                resolve(false);
            }
        });
    }
}
