import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import AddressController from '@controllers/AddressController';
class AddressView extends HttpView {
    public router = express.Router();
    private controller = new AddressController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        //todo maybe weird that its a post.
        // and the urls are not restful.
        this.router.post('/address/get-address', this.controller.getAddress);
        this.router.post('/address/get-address-query', this.controller.getAddressQuery);
    }
}

export default AddressView;
