import { Request, Response } from 'express';
import * as Joi from 'joi';
import RoomService from '@services/RoomService';
import RoomDAO from '@shared/dao/RoomDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { validateCoordinate, validateSchema } from '@shared/utils/rest/ValidateSchema';
import {
    validateEntityExistence,
    validateValueExistence,
} from '@shared/utils/rest/EntitiyValidation';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { Host } from '@shared/entities/Host';
import { getHostIdFromParams } from '@shared/middleware/ExtractHost';
import { multerImage } from '@shared/types/common';

class RoomController {
    private readonly roomService: RoomService;
    private readonly roomDAO: RoomDAO;

    constructor() {
        this.roomService = new RoomService();
        this.roomDAO = new RoomDAO();
    }

    public getRoom = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        if (roomId === undefined) {
            await this.getRooms(req, res);
        } else {
            await this.getSingleRoom(roomId, req, res);
        }
    };

    private getSingleRoom = async (roomId: string, req: Request, res: Response) => {
        try {
            const room = await this.roomDAO.getRoomByUUID(roomId);
            validateEntityExistence(room);
            return res.status(200).send(room);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private getRooms = async (req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const rooms = await this.roomService.getRooms(paginationOptions, req.query);
            return res.status(200).send(rooms);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createRoomSchema: Joi.Schema = Joi.object({
        address: Joi.object({
            street: Joi.string().min(2).max(255).required(),
            houseNumber: Joi.string().min(1).max(40).required(),
            zip: Joi.string().min(2).max(40).required(),
            state: Joi.string().min(2).max(255).required(),
            city: Joi.string().min(2).max(255).required(),
            latitude: Joi.number().custom(validateCoordinate, 'number.precision').required(),
            longitude: Joi.number().custom(validateCoordinate, 'number.precision').required(),
        }).required(),
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(1).max(600).required(),
        hourlyRate: Joi.number().required(),
    });

    public createRoom = async (req: Request, res: Response) => {
        try {
            validateSchema(this.createRoomSchema, req.body);
            const host: Host = req.extractedHost!;

            const createdRoom = await this.roomDAO.createRoom(req.body, host.uuid);

            return res.status(200).json(createdRoom);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    private updateRoomSchema: Joi.Schema = Joi.object({
        address: Joi.object({
            street: Joi.string().min(2).max(255),
            houseNumber: Joi.string().min(1).max(40),
            zip: Joi.string().min(2).max(40),
            state: Joi.string().min(2).max(255),
            city: Joi.string().min(2).max(255),
            latitude: Joi.number().custom(validateCoordinate, 'number.precision'),
            longitude: Joi.number().custom(validateCoordinate, 'number.precision'),
        }).min(1),
        name: Joi.string().min(3).max(255),
        description: Joi.string().min(1).max(600),
        hourlyRate: Joi.number(),
    }).min(1);

    public setRoomImages = async (req: Request, res: Response) => {
        try {
            const images = req.files as multerImage[];
            validateValueExistence(images);
            const roomId = req.params.roomId;
            const updatedHost = await this.roomDAO.setRoomImages(roomId, images);

            return res.status(200).json(updatedHost);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    public updateRoom = async (req: Request, res: Response) => {
        try {
            validateSchema(this.updateRoomSchema, req.body);
            const roomId = req.params.roomId;
            const updatedRoom = await this.roomDAO.updateRoom(roomId, req.body);

            return res.status(200).json(updatedRoom);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default RoomController;
