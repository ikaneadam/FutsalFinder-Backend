import express, { Request, Response } from 'express';
import HttpView from '@shared/interfaces/HttpView';
import { auth } from '@shared/middleware/Auth';
import BookingReservationController from '@controllers/BookingReservationController';
import { Roles } from '@shared/types/Roles';

class BookingReservationView extends HttpView {
    public path = '/rooms/:roomId/bookingReservations/:bookingReservationId?';
    public router = express.Router();
    private controller = new BookingReservationController();

    constructor() {
        super();
        this.routes();
    }

    public routes() {
        this.router.get(
            `/rooms/:roomId/get-available-booking-times`,
            this.controller.getAvailableBookingReservationTimes
        );
        this.router.use(this.path, auth([Roles.user]));
        this.router.post(this.path, this.controller.createBookingReservation);
        this.router.delete(this.path, this.controller.deleteBookingReservation);
        this.router.use(this.path, auth([Roles.user, Roles.admin, Roles.host]));
        this.router.get(this.path, this.controller.getAvailableBookingReservationTimes);
    }
}

export default BookingReservationView;
