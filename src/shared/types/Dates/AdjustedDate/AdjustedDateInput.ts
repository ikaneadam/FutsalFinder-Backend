import { DayOfWeek } from '@shared/entities/StandardAvailableDate';

export type CreateAdjustedDateInput = {
    date: Date;
    availabilityPeriods: {
        startTime: string;
        endTime: string;
    }[];
};

export type UpdateAdjustedDateInput = {
    date?: Date;
    availabilityPeriods?: {
        startTime: string;
        endTime: string;
    }[];
};
