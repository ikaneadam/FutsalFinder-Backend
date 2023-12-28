import { Roles } from '@shared/types/Roles';

export type UserPayload = defaultUserPayload | hostUserPayload;

export type defaultUserPayload = {
    id: string;
    username: string;
    email: string;
    roles: Roles[];
};

export type hostUserPayload = defaultUserPayload & { hostId: string };
