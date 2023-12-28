import { HttpStatusCode } from 'axios';

class EntityNotFound extends Error {
    public httpErrorStatusCode = HttpStatusCode.NotFound;
    constructor(msg?: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EntityNotFound.prototype);
    }
}

export default EntityNotFound;
