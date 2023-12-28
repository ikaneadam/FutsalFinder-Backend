export type CreateRoomInput = {
    address: {
        street: string;
        houseNumber: string;
        zip: string;
        state: string;
        city: string;
        latitude: number;
        longitude: number;
    };
    name: string;
    description?: string;
    hourlyRate: number;
};

export type UpdateRoomInput = {
    address?: {
        street?: string;
        houseNumber?: string;
        zip?: string;
        state?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
    };
    name?: string;
    description?: string;
    hourlyRate?: number;
};
