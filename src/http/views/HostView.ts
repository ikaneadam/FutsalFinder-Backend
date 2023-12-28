import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import HostController from '@controllers/HostController';
import { Roles } from '@shared/types/Roles';

class HostView extends HttpView {
    public path = '/hosts/:hostId?';
    public router = express.Router();
    private controller = new HostController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.getHost);
        this.router.use(this.path, auth([Roles.admin, Roles.host]));
        this.router.put(this.path, this.controller.updateHost);
        this.router.use(this.path, auth([Roles.admin]));
        this.router.post(this.path, this.controller.createHost);
    }
}

export default HostView;
