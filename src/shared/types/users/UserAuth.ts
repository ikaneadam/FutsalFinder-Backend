import { Roles } from '@shared/types/Roles';

export type UserCreateInput = {
    username: string;
    password: string;
    email: string;
    role: Roles;
};

export type UserLoginInput = {
    username: string;
    password: string;
};
