import { Request, Response } from 'express';
import * as Joi from 'joi';
import StandardDateService from '@services/StandardDateService';
import StandardDateDAO from '@shared/dao/StandardDateDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { timeRegex, validateSchema } from '@shared/utils/rest/ValidateSchema';
import { validateEntityExistence } from '@shared/utils/rest/EntitiyValidation';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { DayOfWeek } from '@shared/entities/StandardAvailableDate';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import RoomService from '@services/RoomService';
import ErrorMessages from '@shared/errorMessages';

class StandardDateController {
    private readonly standardDateService: StandardDateService;
    private readonly roomService: RoomService;
    private readonly standardDateDAO: StandardDateDAO;

    constructor() {
        this.standardDateService = new StandardDateService();
        this.standardDateDAO = new StandardDateDAO();
        this.roomService = new RoomService();
    }

    public getStandardDate = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const standardDateId = req.params.standardDateId;
        if (standardDateId === undefined) {
            await this.getStandardDates(roomId, req, res);
        } else {
            await this.getSingleStandardDate(roomId, standardDateId, req, res);
        }
    };

    private getSingleStandardDate = async (
        roomId: string,
        standardDateId: string,
        req: Request,
        res: Response
    ) => {
        try {
            const standardDate = await this.standardDateDAO.getStandardDateByRoomAndDateId(
                roomId,
                standardDateId
            );
            validateEntityExistence(standardDate);
            return res.status(200).send(standardDate);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private getStandardDates = async (roomId: string, req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const standardDates = await this.standardDateDAO.getStandardDates(
                roomId,
                paginationOptions
            );
            return res.status(200).send(standardDates);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createStandardDateSchema = Joi.object({
        dayOfWeek: Joi.number()
            .valid(...Object.values([0, 1, 2, 3, 4, 5, 6]))
            .required(),
        availabilityPeriods: Joi.array()
            .items(
                Joi.object({
                    startTime: Joi.string()
                        .regex(timeRegex)
                        .message(ErrorMessages.dates.invalidTimeFormat)
                        .required(),
                    endTime: Joi.string()
                        .regex(timeRegex)
                        .message(ErrorMessages.dates.invalidTimeFormat)
                        .required(),
                })
            )
            .required(),
    });

    public createStandardDate = async (req: Request, res: Response) => {
        try {
            console.log(Object.values(DayOfWeek));
            validateSchema(this.createStandardDateSchema, req.body);
            const user: TAuthorizedUser = req.user!;
            const roomId = req.params.roomId;
            const room = await this.roomService.handleRoomAuthorization(user, roomId);
            const createdStandardDate = await this.standardDateDAO.createStandardDate(
                room,
                req.body
            );

            return res.status(200).json(createdStandardDate);
        } catch (e: any) {
            console.log(e);
            handleRestExceptions(e, res);
        }
    };

    private updateStandardDateSchema = Joi.object({
        dayOfWeek: Joi.number().valid(...Object.values([0, 1, 2, 3, 4, 5, 6])),
        availabilityPeriods: Joi.array()
            .items(
                Joi.object({
                    startTime: Joi.string()
                        .regex(timeRegex)
                        .message(ErrorMessages.dates.invalidTimeFormat)
                        .required(),
                    endTime: Joi.string()
                        .regex(timeRegex)
                        .message(ErrorMessages.dates.invalidTimeFormat)
                        .required(),
                })
            )
            .min(1),
    });

    public updateStandardDate = async (req: Request, res: Response) => {
        try {
            validateSchema(this.updateStandardDateSchema, req.body);
            const user: TAuthorizedUser = req.user!;
            const roomId = req.params.roomId;
            const standardDateId = req.params.standardDateId;
            const standardDate = await this.standardDateService.handleStandardDateAuthorization(
                user,
                roomId,
                standardDateId
            );
            const updatedStandardDate = await this.standardDateDAO.updateStandardDate(
                standardDate,
                req.body
            );

            return res.status(200).json(updatedStandardDate);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    // public deleteStandardDate = async (req: Request, res: Response) => {
    //     try {
    //         const standardDateId = req.params.standardDateId;
    //         const updatedStandardDate = await this.standardDateDAO.updateStandardDate(
    //             standardDateId,
    //             req.body
    //         );
    //
    //         return res.status(200).json(updatedStandardDate);
    //     } catch (e: any) {
    //         handleRestExceptions(e, res);
    //     }
    // };
}

export default StandardDateController;
