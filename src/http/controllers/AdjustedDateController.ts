import { Request, Response } from 'express';
import * as Joi from 'joi';
import AdjustedDateService from '@services/AdjustedDateService';
import AdjustedDateDAO from '@shared/dao/AdjustedDateDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import {
    dateRegex,
    timeRegex,
    validateSchema,
    validateTimeSlot,
} from '@shared/utils/rest/ValidateSchema';
import { validateEntityExistence } from '@shared/utils/rest/EntitiyValidation';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import RoomService from '@services/RoomService';
import ErrorMessages from '@shared/errorMessages';
import errorMessages from '@shared/errorMessages';

class AdjustedDateController {
    private readonly adjustedDateService: AdjustedDateService;
    private readonly roomService: RoomService;
    private readonly adjustedDateDAO: AdjustedDateDAO;

    constructor() {
        this.adjustedDateService = new AdjustedDateService();
        this.adjustedDateDAO = new AdjustedDateDAO();
        this.roomService = new RoomService();
    }

    public getAdjustedDate = async (req: Request, res: Response) => {
        const roomId = req.params.roomId;
        const adjustedDateId = req.params.adjustedDateId;
        if (adjustedDateId === undefined) {
            await this.getAdjustedDates(roomId, req, res);
        } else {
            await this.getSingleAdjustedDate(roomId, adjustedDateId, req, res);
        }
    };

    private getSingleAdjustedDate = async (
        roomId: string,
        adjustedDateId: string,
        req: Request,
        res: Response
    ) => {
        try {
            const adjustedDate = await this.adjustedDateDAO.getAdjustedDateByRoomAndDateId(
                roomId,
                adjustedDateId
            );
            validateEntityExistence(adjustedDate);
            return res.status(200).send(adjustedDate);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private getAdjustedDates = async (roomId: string, req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const adjustedDates = await this.adjustedDateDAO.getAdjustedDates(
                roomId,
                paginationOptions
            );
            return res.status(200).send(adjustedDates);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createAdjustedDateSchema = Joi.object({
        date: Joi.string()
            .regex(dateRegex)
            .message(errorMessages.dates.invalidDateFormat)
            .required(),
        availabilityPeriods: Joi.array()
            .items(
                Joi.object({
                    startTime: Joi.string()
                        .regex(timeRegex)
                        .message(errorMessages.dates.invalidTimeFormat)
                        // Use .custom() method for custom validation logic
                        .custom(validateTimeSlot, 'custom validation for start time')
                        .required(),
                    endTime: Joi.string()
                        .regex(timeRegex)
                        .message(errorMessages.dates.invalidTimeFormat)
                        // Use .custom() method for custom validation logic
                        .custom(validateTimeSlot, 'custom validation for end time')
                        .required(),
                })
            )
            .required(),
    });

    public createAdjustedDate = async (req: Request, res: Response) => {
        try {
            validateSchema(this.createAdjustedDateSchema, req.body);
            // const user: TAuthorizedUser = req.user!;
            // const roomId = req.params.roomId;
            // const room = await this.roomService.handleRoomAuthorization(user, roomId);
            // const createdAdjustedDate = await this.adjustedDateDAO.createAdjustedDate(
            //     room,
            //     req.body
            // );

            return res.status(200).json(req.body);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    private updateAdjustedDateSchema = Joi.object({
        date: Joi.string()
            .regex(dateRegex)
            .message(errorMessages.dates.invalidDateFormat)
            .required(),
        availabilityPeriods: Joi.array()
            .items(
                Joi.object({
                    startTime: Joi.string()
                        .regex(timeRegex)
                        .message(errorMessages.dates.invalidTimeFormat)
                        // Use .custom() method for custom validation logic
                        .custom(validateTimeSlot, 'custom validation for start time')
                        .required(),
                    endTime: Joi.string()
                        .regex(timeRegex)
                        .message(errorMessages.dates.invalidTimeFormat)
                        // Use .custom() method for custom validation logic
                        .custom(validateTimeSlot, 'custom validation for end time')
                        .required(),
                })
            )
            .required()
            .min(1),
    });

    public updateAdjustedDate = async (req: Request, res: Response) => {
        try {
            validateSchema(this.updateAdjustedDateSchema, req.body);
            const user: TAuthorizedUser = req.user!;
            const roomId = req.params.roomId;
            const adjustedDateId = req.params.adjustedDateId;
            const adjustedDate = await this.adjustedDateService.handleAdjustedDateAuthorization(
                user,
                roomId,
                adjustedDateId
            );
            const updatedAdjustedDate = await this.adjustedDateDAO.updateAdjustedDate(
                adjustedDate,
                req.body
            );

            return res.status(200).json(updatedAdjustedDate);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    // public deleteadjustedDate = async (req: Request, res: Response) => {
    //     try {
    //         const adjustedDateId = req.params.adjustedDateId;
    //         const updatedadjustedDate = await this.adjustedDateDAO.updateadjustedDate(
    //             adjustedDateId,
    //             req.body
    //         );
    //
    //         return res.status(200).json(updatedadjustedDate);
    //     } catch (e: any) {
    //         handleRestExceptions(e, res);
    //     }
    // };
}

export default AdjustedDateController;
