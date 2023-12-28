import { HttpStatusCode } from 'axios';

class Conflict extends Error {
    public httpErrorStatusCode = HttpStatusCode.Conflict;
    public error: any;
    //todo do this for then rest of the exceptions aswell
    constructor(msg: object) {
        super(JSON.stringify(msg));
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, Conflict.prototype);
        this.error = msg;
    }
}

export default Conflict;
