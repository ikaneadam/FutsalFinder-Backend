import { HttpStatusCode } from 'axios';

class Unauthorized extends Error {
    public httpErrorStatusCode = HttpStatusCode.Unauthorized;
    constructor(msg: string = 'Unauthorized') {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, Unauthorized.prototype);
    }
}

export default Unauthorized;
