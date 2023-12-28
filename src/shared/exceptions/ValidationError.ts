import { HttpStatusCode } from 'axios';

class ValidationError extends Error {
    public httpErrorStatusCode = HttpStatusCode.BadRequest;
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export default ValidationError;
