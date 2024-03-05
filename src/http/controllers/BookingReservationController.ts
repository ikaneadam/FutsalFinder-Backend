import { Request, Response } from 'express';
import * as Joi from 'joi';
import BookingReservationService from '@services/BookingReservationService';
import BookingReservationDAO from '@shared/dao/BookingReservationDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import BuildPaginationOptionsFromQueryParameters from '@shared/pagination/BuildPaginationOptionsFromQueryParameters';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import { validateEntityExistence } from '@shared/utils/rest/EntitiyValidation';
import {
    dateRegex,
    timeRegex,
    validateSchema,
    validateTimeSlot,
} from '@shared/utils/rest/ValidateSchema';
import errorMessages from '@shared/errorMessages';
import { TAuthorizedUser } from '@shared/middleware/Auth';

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
        try {
            const paginationOptions: PaginationOptions =
                await BuildPaginationOptionsFromQueryParameters.buildPaginationOptionsFromQueryParameters(
                    req
                );
            const user: TAuthorizedUser = req.user!;
            const reservations = await this.bookingReservationDAO.getBookingReservationByUserUUID(
                paginationOptions,
                user.id
            );
            return res.status(200).send(reservations);
        } catch (error) {
            handleRestExceptions(error, res);
        }
    };

    private createBookingReservationSchema: Joi.Schema = Joi.object({
        date: Joi.string()
            .regex(dateRegex)
            .message(errorMessages.dates.invalidDateFormat)
            .required(),

        startTime: Joi.string().regex(timeRegex).required(),
        endTime: Joi.string().regex(timeRegex).required(),
    });

    public createBookingReservation = async (req: Request, res: Response) => {
        try {
            validateSchema(this.createBookingReservationSchema, req.body);
            this.bookingReservationService.validateBookingReservation(req.body);

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
            handleRestExceptions(e, res);
        }
    };
}

export default BookingReservationController;
