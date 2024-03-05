import entityNotFound from '@shared/exceptions/EntityNotFound';
import badRequest from '@shared/exceptions/BadRequest';

export function validateEntityExistence<t>(entity: t | null): entity is t {
    if (entity === null || entity === undefined) {
        throw new entityNotFound();
    }
    return true;
}

export function validateValueExistence<t>(value: any) {
    if (value === null || value === undefined) {
        throw new badRequest();
    }
}
