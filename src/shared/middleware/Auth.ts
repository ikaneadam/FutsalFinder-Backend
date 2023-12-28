import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Host } from '@shared/entities/Host';
import { Roles } from '@shared/types/Roles';

dotenv.config();

export type TAuthorizedUser = {
    id: string;
    username: string;
    roles: Roles[];
    hostId?: string;
};

declare global {
    namespace Express {
        interface Request {
            user?: TAuthorizedUser;
            extractedHost?: Host;
            hostId?: string;
        }
    }
}

// not mine code but too lazy
export const auth =
    (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
        const secret = process.env.ACCESS_TOKEN_SECRET as string;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        try {
            const decodedUser = jwt.verify(token, secret) as JwtPayload;
            if (!decodedUser) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Check if the user has the required role(s)
            const userRoles = decodedUser.roles;
            const hasRole = roles.some((r) => userRoles.includes(r));

            if (!hasRole) {
                return res.status(403).json({
                    message: `Only ${roles.join(', ')} can access this resource`,
                });
            }

            // destructure for clarity
            if (!decodedUser || decodedUser.user) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                const { id, username } = decodedUser;
                const _user: TAuthorizedUser = {
                    id,
                    username,
                    roles: userRoles,
                    hostId: decodedUser.hostId,
                };
                req.user = _user;
            }

            next();
        } catch (e) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
