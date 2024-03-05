import BookingReservationDAO from '@shared/dao/BookingReservationDAO';
import errorMessages from '@shared/errorMessages';
import StandardDateDAO from '@shared/dao/StandardDateDAO';
import AdjustedDateDAO from '@shared/dao/AdjustedDateDAO';
import RoomDAO from '@shared/dao/RoomDAO';
import { Room } from '@shared/entities/Room';
import { parseISO, isAfter } from 'date-fns';
import BadRequest from '@shared/exceptions/BadRequest';

class BookingReservationService {
    private readonly bookingReservationDAO: BookingReservationDAO;
    private readonly standardDateDAO: StandardDateDAO;
    private readonly adjustedDateDAO: AdjustedDateDAO;
    private readonly roomDAO: RoomDAO;

    constructor() {
        this.bookingReservationDAO = new BookingReservationDAO();
        this.standardDateDAO = new StandardDateDAO();
        this.adjustedDateDAO = new AdjustedDateDAO();
        this.roomDAO = new RoomDAO();
    }

    public validateBookingReservation(reservation: {
        date: string;
        startTime: string;
        endTime: string;
    }) {
        if (!this.isReservationIsInFuture(reservation)) {
            throw new BadRequest('reservation must be in future');
        }
    }

    private isReservationIsInFuture(reservation: {
        date: string;
        startTime: string;
        endTime: string;
    }): boolean {
        const now = new Date();

        const reservationStartDateTime = new Date(
            `${reservation.date}T${reservation.startTime}:00`
        );
        const reservationEndDateTime = new Date(`${reservation.date}T${reservation.endTime}:00`);

        // Check if both start and end times are in the future
        return reservationStartDateTime > now && reservationEndDateTime > now;
    }
}

export default BookingReservationService;
