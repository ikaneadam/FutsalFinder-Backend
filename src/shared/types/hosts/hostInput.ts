export type CreateHostInput = {
    name: string;
    description?: string;
    iban?: string;
    phoneNumber?: string;
    email?: string;
};

export type UpdateHostInput = {
    name?: string;
    description?: string;
    iban?: string;
    phoneNumber?: string;
    email?: string;
};
