import express from 'express';
import { Express } from 'express-serve-static-core';
import { AppDataSource } from './data-source';
import * as path from 'path';
import HttpView from '@shared/interfaces/HttpView';

class BackendApp {
    public app: Express;
    public port: number;
    constructor(appInit: { port: any; views: HttpView[]; middleWares: any }) {
        this.app = express();
        this.port = appInit.port;
        this.staticFiles();
        this.middlewares(appInit.middleWares);
        this.routes(appInit.views);

        AppDataSource.initialize()
            .then(async () => {})
            .catch((error) => console.log(error));
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }

    private routes(controllers: HttpView[]) {
        controllers.forEach((controller: HttpView) => {
            this.app.use('/api/v1', controller.router);
        });

        this.app.use((req, res, next) => {
            res.status(404).send('<h1> Page not found </h1>');
        });
    }

    private staticFiles() {
        this.app.use('/api/v1/static', express.static(path.join(__dirname, '../fileStorage')));
    }

    public listen() {
        const server = this.app.listen(this.port);
        console.log(`Server listening on http://localhost:${this.port}`);
        return server;
    }
}

export default BackendApp;
