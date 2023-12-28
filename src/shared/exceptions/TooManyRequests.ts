import { HttpStatusCode } from 'axios';

class TooManyRequests extends Error {
    public httpErrorStatusCode = HttpStatusCode.TooManyRequests;
    constructor(msg: string, customErrorCode?: HttpStatusCode) {
        super(msg);

        this.httpErrorStatusCode = this.httpErrorStatusCode ?? customErrorCode;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TooManyRequests.prototype);
    }
}

export default TooManyRequests;
