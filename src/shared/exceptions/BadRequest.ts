import { HttpStatusCode } from 'axios';

class BadRequest extends Error {
    public httpErrorStatusCode = HttpStatusCode.BadRequest;
    constructor(msg?: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BadRequest.prototype);
    }
}

export default BadRequest;
