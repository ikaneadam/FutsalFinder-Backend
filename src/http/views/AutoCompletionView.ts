import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import { Roles } from '@shared/types/Roles';
import AutoCompletionController from '@controllers/AutoCompletionController';

class AutoCompletionView extends HttpView {
    public path = '/search-predictions';
    public router = express.Router();
    private controller = new AutoCompletionController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.getPredictions);
    }
}

export default AutoCompletionView;
