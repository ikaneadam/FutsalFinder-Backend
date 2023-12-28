import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import UserController from '@controllers/UserController';

class UserView extends HttpView {
    public path = '/users/:id?';
    public router = express.Router();
    private controller = new UserController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.post(`${this.path}/login`, this.controller.refreshToken);
        this.router.post(`${this.path}/register`, this.controller.createUser);
        // this.router.use(this.path, auth([Roles.admin]));
        // this.router.post(this.path, this.controller.createUser);
    }
}

export default UserView;
