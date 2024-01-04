import { Request, Response } from 'express';
import * as Joi from 'joi';
import BookingReservationService from '@services/BookingReservationService';
import BookingReservationDAO from '@shared/dao/BookingReservationDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { validateEntityExistence } from '@shared/utils/rest/EntitiyValidation';
import { isDateFuture, timeRegex, validateSchema } from '@shared/utils/rest/ValidateSchema';
import { DayOfWeek } from '@shared/entities/StandardAvailableDate';
import errorMessages from '@shared/errorMessages';
import ErrorMessages from '@shared/errorMessages';

class BookingReservationController {
    private readonly bookingReservationService: BookingReservationService;
    private readonly bookingReservationDAO: BookingReservationDAO;

    constructor() {
        this.bookingReservationService = new BookingReservationService();
        this.bookingReservationDAO = new BookingReservationDAO();
    }
    public getAvailableBookingReservationTimes = async (req: Request, res: Response) => {
        try {
            //todo able to choose end date
            const roomId = req.params.roomId;
            const bookingReservations =
                await this.bookingReservationDAO.getThisWeeksAvailableReservationTimes(roomId);
            validateEntityExistence(bookingReservations);
            return res.status(200).send(bookingReservations);
        } catch (e) {
            console.log(e);
            handleRestExceptions(e, res);
        }
    };

    public getBookingReservation = async (req: Request, res: Response) => {
        const bookingReservationId = req.params.bookingReservationId;
        if (bookingReservationId === undefined) {
            await this.getBookingReservations(req, res);
        } else {
            await this.getSingleBookingReservation(bookingReservationId, req, res);
        }
    };

    private getSingleBookingReservation = async (
        bookingReservationId: string,
        req: Request,
        res: Response
    ) => {
        try {
            const bookingReservation = await this.bookingReservationDAO.getBookingReservationByUUID(
                bookingReservationId
            );
            validateEntityExistence(bookingReservation);
            return res.status(200).send(bookingReservation);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private getBookingReservations = async (req: Request, res: Response) => {
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );

            const bookingReservations = await this.bookingReservationDAO.getBookingReservations(
                paginationOptions
            );
            return res.status(200).send(bookingReservations);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createBookingReservationSchema: Joi.Schema = Joi.object({
        date: Joi.string().custom(isDateFuture).messages({
            'date.invalid': errorMessages.dates.invalidDateFormat,
            'date.noDate': errorMessages.dates.dateIsNotPossible,
            'date.mustBeFuture': errorMessages.dates.dateMustBeFuture,
        }),
        startTime: Joi.string()
            .regex(timeRegex)
            .message(ErrorMessages.dates.invalidTimeFormat)
            .required(),
        endTime: Joi.string()
            .regex(timeRegex)
            .message(ErrorMessages.dates.invalidTimeFormat)
            .required(),
    });

    public createBookingReservation = async (req: Request, res: Response) => {
        try {
            validateSchema(this.createBookingReservationSchema, req.body);
            const user = req.user!;
            const roomId = req.params.roomId;
            const createdBookingReservation =
                await this.bookingReservationDAO.createBookingReservation(
                    user.id,
                    roomId,
                    req.body
                );

            return res.status(200).json(createdBookingReservation);
        } catch (e: any) {
            console.log(e);
            handleRestExceptions(e, res);
        }
    };

    private updateBookingReservationSchema: Joi.Schema = Joi.object({}).min(1);

    public deleteBookingReservation = async (req: Request, res: Response) => {
        try {
            return res.status(200).json('ogho');
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default BookingReservationController;
