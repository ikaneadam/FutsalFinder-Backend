import { TimeBlock } from '@shared/entities/TimeBlock';

export function isTimeRangeAvailable(
    startTime: string,
    endTime: string,
    availableTimes: TimeBlock[] | undefined
): boolean {
    if (availableTimes === undefined) {
        return false;
    }
    const requestedStartTime = timeToSeconds(startTime);
    const requestedEndTime = timeToSeconds(endTime);
    // Handle the case where the requested time range spans across midnight
    if (requestedEndTime <= requestedStartTime) {
        return false;
        //TODO for another release
    }
    for (const availableTimeBlock of availableTimes) {
        //TODO WHAT IF A USER WANTS TO RESERVE A PLACE FROM 2300 TO 0100
        // WE ARE DOING EVERYTHING PER DATE
        // the for loop above can fix this but no time.
        const availableTimeBlockStartTime = timeToSeconds(availableTimeBlock.startTime);
        const availableTimeBlockEndTime = timeToSeconds(availableTimeBlock.endTime);
        const isStartBetweenAvailableTimeBlock =
            requestedStartTime >= availableTimeBlockStartTime &&
            requestedStartTime < availableTimeBlockEndTime;

        const isEndBetweenAvailableTimeBlock =
            requestedEndTime > availableTimeBlockStartTime &&
            requestedEndTime <= availableTimeBlockEndTime;

        if (isStartBetweenAvailableTimeBlock && isEndBetweenAvailableTimeBlock) {
            return true;
        }
    }

    return false;
}

function timeToSeconds(time: string): number {
    const [hh, mm, ss = 0] = time.split(':').map(Number);
    return hh * 3600 + mm * 60 + ss;
}
