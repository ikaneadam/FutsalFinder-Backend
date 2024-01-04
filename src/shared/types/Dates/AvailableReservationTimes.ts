import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';

export type AvailableReservationTimes = {
    roomUUID: string;
    roomName: string;
    availableTimes: AdjustedAvailableDate | StandardAvailableDate[];
};

export type AvailableReservationTime = {
    roomUUID: string;
    roomName: string;
    availableTime?: AdjustedAvailableDate | StandardAvailableDate | undefined;
};
