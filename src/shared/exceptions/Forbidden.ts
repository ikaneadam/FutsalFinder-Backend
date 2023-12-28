import { HttpStatusCode } from 'axios';

class Forbidden extends Error {
    public httpErrorStatusCode = HttpStatusCode.Forbidden;
    constructor(msg: string = 'Forbidden') {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, Forbidden.prototype);
    }
}

export default Forbidden;
