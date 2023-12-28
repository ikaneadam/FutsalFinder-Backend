import { HttpStatusCode } from 'axios';

class InternalServerError extends Error {
    public httpErrorStatusCode = HttpStatusCode.InternalServerError;
    constructor(msg?: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export default InternalServerError;
