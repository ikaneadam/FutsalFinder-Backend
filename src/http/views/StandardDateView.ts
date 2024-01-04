import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import StandardDateController from '@controllers/StandardDateController';
import { Roles } from '@shared/types/Roles';

class StandardDateView extends HttpView {
    public path = '/rooms/:roomId?/standardDates/:standardDateId?';
    public router = express.Router();
    private controller = new StandardDateController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.getStandardDate);
        this.router.use(this.path, auth([Roles.admin, Roles.host]));
        this.router.post(this.path, this.controller.createStandardDate);
        this.router.put(this.path, this.controller.updateStandardDate);
    }
}

export default StandardDateView;
