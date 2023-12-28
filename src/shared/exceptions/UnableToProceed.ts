import { HttpStatusCode } from 'axios';

class UnableToProceed extends Error {
    public httpErrorStatusCode = HttpStatusCode.BadRequest;
    constructor(msg: string, customErrorCode?: HttpStatusCode) {
        super(msg);

        this.httpErrorStatusCode = this.httpErrorStatusCode ?? customErrorCode;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UnableToProceed.prototype);
    }
}

export default UnableToProceed;
