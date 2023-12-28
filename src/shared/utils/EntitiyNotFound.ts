import entityNotFound from '@shared/exceptions/EntityNotFound';
import errorMessages from '@shared/errorMessages';

export function validateEntityExistence<t>(entity: t | null): entity is t {
    if (entity === null) {
        throw new entityNotFound();
    }
    return true;
}
