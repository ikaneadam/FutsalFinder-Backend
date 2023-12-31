import { DayOfWeek } from '@shared/entities/StandardAvailableDate';

export type CreateStandardDateInput = {
    dayOfWeek: DayOfWeek;
    availabilityPeriods: {
        startTime: string;
        endTime: string;
    }[];
};

export type UpdateStandardDateInput = {
    dayOfWeek?: DayOfWeek;
    availabilityPeriods: {
        startTime: string;
        endTime: string;
    }[];
};
