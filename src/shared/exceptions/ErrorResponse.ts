import { HttpStatusCode } from 'axios';

class ErrorResponse extends Error {
    public httpErrorStatusCode = HttpStatusCode.BadRequest;
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ErrorResponse.prototype);
    }
}

export default ErrorResponse;
