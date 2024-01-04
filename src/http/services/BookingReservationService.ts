import BookingReservationDAO from '@shared/dao/BookingReservationDAO';
import errorMessages from '@shared/errorMessages';
import StandardDateDAO from '@shared/dao/StandardDateDAO';
import AdjustedDateDAO from '@shared/dao/AdjustedDateDAO';
import RoomDAO from '@shared/dao/RoomDAO';
import { Room } from '@shared/entities/Room';

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

    public isBookingPossible(bookingDate: Date, startTime: string, endTime: string) {}
}

export default BookingReservationService;
