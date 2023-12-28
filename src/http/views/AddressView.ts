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
        this.router.post('/address/get-address', this.controller.getAddress);
    }
}

export default AddressView;
