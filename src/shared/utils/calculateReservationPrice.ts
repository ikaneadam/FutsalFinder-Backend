import { timeToSeconds } from '@shared/utils/isTimeRangeAvailable';

export function calculateReservationPrice(
    startTime: string,
    endTime: string,
    hourlyRate: number
): number {
    const startTimeInSeconds = timeToSeconds(startTime);
    const endTimeInSeconds = timeToSeconds(endTime);
    const totalTimeInSeconds = endTimeInSeconds - startTimeInSeconds;
    const secondsInHour = 3600;
    const totalTimeInHours = totalTimeInSeconds / secondsInHour;
    return totalTimeInHours * hourlyRate;
}
//todo check below
//what happens if the end time is before the start time?
// what happens if the start and end time are the same?
