import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@shared/entities/User';
import { hostUserPayload, UserPayload } from '@shared/types/users/UserPayload';
import { Role } from '@shared/entities/Role';
import { Roles } from '@shared/types/Roles';

dotenv.config();

const JWTSecret = process.env.ACCESS_TOKEN_SECRET as string;
async function generateToken(user: User): Promise<string> {
    const userPayload: UserPayload = parseUserToPayload(user);
    return jwt.sign(userPayload, JWTSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
}

//todo look for a way to remove this casting
function parseUserToPayload(user: User): UserPayload {
    const userPayload: UserPayload = {
        id: user.uuid,
        username: user.username,
        email: user.email,
        roles: (user.roles?.map((role: Role) => role.name) as Roles[]) ?? [],
    };

    if (user.host) {
        // why is typescript so annoying sometimes
        (userPayload as hostUserPayload).hostId = user.host.uuid;
    }

    return userPayload;
}

export { generateToken };
