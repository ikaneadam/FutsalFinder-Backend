import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import { Roles } from '@shared/types/Roles';
import AdjustedDateController from '@controllers/AdjustedDateController';

class AdjustedDateView extends HttpView {
    public path = '/rooms/:roomId?/adjustedDates/:adjustedDateId?';
    public router = express.Router();
    private controller = new AdjustedDateController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.getAdjustedDate);
        this.router.use(this.path, auth([Roles.admin, Roles.host]));
        this.router.post(this.path, this.controller.createAdjustedDate);
        this.router.put(this.path, this.controller.updateAdjustedDate);
    }
}

export default AdjustedDateView;
