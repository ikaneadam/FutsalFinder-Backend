import e, { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { HttpStatusCode, AxiosError } from 'axios';
const handleKnownExceptions = (error: any, res: Response) => {
    if (!error?.httpErrorStatusCode) {
        return;
    }

    if (error?.message) {
        return res.status(error.httpErrorStatusCode).send({ error: error.message });
    }

    return res.status(error.httpErrorStatusCode).send();
};

export const handleRestExceptions = (
    error: any,
    res: Response
): e.Response<any, Record<string, any>> => {
    handleKnownExceptions(error, res);

    if (error instanceof QueryFailedError) {
        handleQueryFailedError(error.driverError, res);
    }

    if (error instanceof AxiosError) {
        return res
            .status(HttpStatusCode.InternalServerError)
            .send({ error: 'error connecting to external service' });
    }

    return res.status(HttpStatusCode.InternalServerError).send();
};

const handleQueryFailedError = (error: any, res: Response) => {
    const duplicateFieldErrorCode = '23505';
    const violatesForeignKeyConstraintErrorCode = '23503';
    const uniqueConstraintErrorCode = '23505';
    const invalidUUIDErrorCode = '22P02';

    switch (error?.code!) {
        case duplicateFieldErrorCode:
            handleDuplicateFieldError(error?.detail!, res);
            break;

        case violatesForeignKeyConstraintErrorCode:
            handleViolatesForeignKeyConstraintError(res);
            break;
        case uniqueConstraintErrorCode: // Error code for unique constraint violation in TypeORM
            handleUniqueFieldError(error?.detail!, res);
            break;
        case invalidUUIDErrorCode: // Error code for unique constraint violation in TypeORM
            handleInvalidUUIDErrorCode(res);
            break;

        default:
            break;
    }
};

function handleUniqueFieldError(errorDetail: string | undefined, res: Response) {
    if (!errorDetail) {
        const message = 'This field must be unique.';
        return res.status(HttpStatusCode.BadRequest).send({ error: message });
    }

    const matches = errorDetail.match(/Key \((.*?)\)/);
    const fieldName = matches ? matches[1] : '';

    const message = `${fieldName} must be unique.`;

    return res.status(HttpStatusCode.BadRequest).send({ error: message });
}
function handleInvalidUUIDErrorCode(res: Response) {
    //this is not only for uuid see example below
    // so we must check if it says uuid and then only send 404 and for other things is 400 enough
    //QueryFailedError: invalid input value for enum standard_available_date_dayofweek_enum: "Monday"
    //todo see above
    return res.status(HttpStatusCode.NotFound).send();
}

function handleDuplicateFieldError(errorDetail: string | undefined, res: Response) {
    const message = errorDetail?.replace(
        /^Key \((.*)\)=\((.*)\) (.*)/,
        'This $1 $2 already exists.'
    );
    return res.status(HttpStatusCode.BadRequest).send({ error: message });
}

function handleViolatesForeignKeyConstraintError(res: Response) {
    const message = 'Entity cannot be deleted/updated because it is referenced somewhere else.';
    return res.status(HttpStatusCode.BadRequest).send({ error: message });
}
