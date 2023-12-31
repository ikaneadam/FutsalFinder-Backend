import { Request, Response } from 'express';
import * as Joi from 'joi';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { validateSchema } from '@shared/utils/rest/ValidateSchema';
import HostDAO from '@shared/dao/HostDAO';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { FindOptionsWhere } from 'typeorm';
import {
    validateEntityExistence,
    validateValueExistence,
} from '@shared/utils/rest/EntitiyValidation';
import { getHostIdFromParams } from '@shared/middleware/ExtractHost';
import multer, { Multer } from 'multer';
import { multerImage } from '@shared/types/common';

class HostController {
    private readonly hostDAO: HostDAO;
    constructor() {
        this.hostDAO = new HostDAO();
    }

    public getHost = async (req: Request, res: Response) => {
        const hostId = req.params.hostId;
        if (hostId === undefined) {
            await this.getHosts(req, res);
        } else {
            await this.getSingleHost(hostId, req, res);
        }
    };

    private getSingleHost = async (hostId: string, req: Request, res: Response) => {
        try {
            const host = await this.hostDAO.getHostByUUID(hostId);
            validateEntityExistence(host);
            return res.status(200).send(host);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private getHosts = async (req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const hosts = await this.hostDAO.getHosts(paginationOptions);
            return res.status(200).send(hosts);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createRoomSchema: Joi.Schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(1).max(600),
        email: Joi.string().email().min(1).max(40),
        phoneNumber: Joi.string().length(10), //todo real validation
        iban: Joi.string().length(18), //todo real validation
    });

    public createHost = async (req: Request, res: Response) => {
        try {
            validateSchema(this.createRoomSchema, req.body);

            const createdHost = await this.hostDAO.createHost(req.body);

            return res.status(200).json(createdHost);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    public setHostImages = async (req: Request, res: Response) => {
        try {
            const hostId = getHostIdFromParams(req);
            const images = req.files as multerImage[];
            validateValueExistence(images);
            const updatedHost = await this.hostDAO.setHostImages(hostId, images);

            return res.status(200).json(updatedHost);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    private updateRoomSchema: Joi.Schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30),
        description: Joi.string().min(1).max(600),
        email: Joi.string().email().min(1).max(40),
        phoneNumber: Joi.string().length(10), //todo real validation
        iban: Joi.string().length(18), //todo real validation
    }).min(1);

    public updateHost = async (req: Request, res: Response) => {
        try {
            validateSchema(this.updateRoomSchema, req.body);
            const hostId = getHostIdFromParams(req);
            const updatedHost = await this.hostDAO.updateHost(hostId, req.body);

            return res.status(200).json(updatedHost);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default HostController;
