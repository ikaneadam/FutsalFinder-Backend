import BadRequest from '@shared/exceptions/BadRequest';
import * as Joi from 'joi';

export function validateSchema(schema: Joi.Schema, body: any) {
    const { error } = schema.validate(body, { convert: false });
    if (error) {
        throw new BadRequest(error.details[0].message);
    }
}

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
