import { HttpStatusCode } from 'axios';

class OK extends Error {
    public httpErrorStatusCode = HttpStatusCode.Ok;
    constructor(msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, OK.prototype);
    }
}

export default OK;
