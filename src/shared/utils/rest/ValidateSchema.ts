import BadRequest from '@shared/exceptions/BadRequest';
import * as Joi from 'joi';
import errorMessages from '@shared/errorMessages';
import { parse } from 'date-fns';

export function validateSchema(schema: Joi.Schema, body: any) {
    const { error } = schema.validate(body, { convert: false });
    if (error) {
        throw new BadRequest(error.details[0].message);
    }
}

export const timeRegex = /^([01]\d|2[0-3]):([03]0)$/;
export const dateRegex = /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const isValidFutureDate = (date: Date): boolean => {
    const currentDate = new Date();
    return date > currentDate;
};

export const isDateFuture = (value: string, helpers: Joi.CustomHelpers<string>) => {
    if (!value.match(dateRegex)) {
        return helpers.error('date.invalid');
    }

    const date = parse(value, 'yyyy-MM-dd', new Date());

    if (isNaN(date.getTime())) {
        return helpers.error('date.noDate');
    }

    if (!isValidFutureDate(date)) {
        return helpers.error('date.mustBeFuture');
    }

    return value;
};

export const validateCoordinate = (value: number, helpers: Joi.CustomHelpers<number>) => {
    if (!Number.isFinite(value)) {
        return helpers.error('number.invalid');
    }

    const stringValue = value.toString();
    const decimalIndex = stringValue.indexOf('.');

    if (
        decimalIndex === -1 ||
        stringValue.length - decimalIndex - 1 !== 6 ||
        decimalIndex === stringValue.length - 1
    ) {
        return helpers.error('number.precision');
    }

    return value;
};
