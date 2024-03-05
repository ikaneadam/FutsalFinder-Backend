import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import RoomController from '@controllers/RoomController';
import { Roles } from '@shared/types/Roles';
import { ExtractHost } from '@shared/middleware/ExtractHost';
import fileUpload from '@shared/middleware/FileUpload';

class RoomView extends HttpView {
    public path = '/rooms/:roomId?';
    public parentPath = `/hosts/:hostId?${this.path}`;
    public router = express.Router();
    private controller = new RoomController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(this.path, this.controller.getRoom);
        this.router.use(this.parentPath, auth([Roles.admin, Roles.host]));
        this.router.post(
            this.path + '/pictures',
            fileUpload.array('images', 20),
            this.controller.setRoomImages
        );
        this.router.use(this.parentPath, ExtractHost);
        this.router.post(this.parentPath, this.controller.createRoom);
        this.router.put(this.parentPath, this.controller.updateRoom);
    }
}

export default RoomView;
