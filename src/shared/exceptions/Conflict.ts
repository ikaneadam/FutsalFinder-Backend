import { HttpStatusCode } from 'axios';

class Conflict extends Error {
    public httpErrorStatusCode = HttpStatusCode.BadRequest;
    constructor(msg?: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, Conflict.prototype);
    }
}

export default Conflict;
