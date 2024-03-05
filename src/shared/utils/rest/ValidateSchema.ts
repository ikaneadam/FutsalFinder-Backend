import BadRequest from '@shared/exceptions/BadRequest';
import * as Joi from 'joi';

import { parse } from 'date-fns';
import { parseISO, isFuture, differenceInMinutes } from 'date-fns';

export function validateSchema(schema: Joi.Schema, body: any) {
    const { error } = schema.validate(body, { convert: false });
    if (error) {
        throw new BadRequest(error.details[0].message);
    }
}

export const timeRegex = /^([01]\d|2[0-3]):([03]0)$/;
export const dateRegex = /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const errorMessages = {
    dates: {
        invalidDateFormat: 'Invalid date format.',
        dateIsNotPossible: 'Date is not valid.',
        dateMustBeFuture: 'Date must be in the future.',
        invalidTimeFormat: 'Invalid time format.',
        timeSlotNotFuture: 'Time slot must be in the future.',
        // Add more error messages as needed
    },
};
const isValidFutureDate = (date: Date): boolean => {
    const currentDate = new Date();
    return date > currentDate;
};

const isDateTimeFuture = (dateString: string, timeString: string) => {
    const datetime = parseISO(`${dateString}T${timeString}`);
    return isFuture(datetime);
};

export const validateTimeSlot = (value: any, helpers: any) => {
    const { date } = helpers.state.ancestors[1];
    if (!isDateTimeFuture(date, value)) {
        return helpers.error('date.timeSlotNotFuture');
    }
    return value;
};

export const validateCoordinate = (value: number, helpers: Joi.CustomHelpers<number>) => {
    if (!Number.isFinite(value)) {
        return helpers.error('number.invalid');
    }

    return value;
};
