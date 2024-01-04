import { DeleteResult, Equal, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { BookingReservation } from '@shared/entities/BookingReservation';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { CreateBookingReservationInput } from '@shared/types/BookingReservation/BookingReservationInput';
import { DayOfWeek, StandardAvailableDate } from '@shared/entities/StandardAvailableDate';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
import { Room } from '@shared/entities/Room';
import errorMessages from '@shared/errorMessages';
import {
    AvailableReservationTime,
    AvailableReservationTimes,
} from '@shared/types/Dates/AvailableReservationTimes';
import { isTimeRangeAvailable } from '@shared/utils/isTimeRangeAvailable';
import { TimeBlock } from '@shared/entities/TimeBlock';
import Conflict from '@shared/exceptions/Conflict';

class BookingReservationDAO {
    private bookingReservationRepository: Repository<BookingReservation>;
    private roomRepository: Repository<Room>;
    private standardDateRepository: Repository<StandardAvailableDate>;
    private adjustedDateRepository: Repository<AdjustedAvailableDate>;

    constructor() {
        this.bookingReservationRepository = AppDataSource.getRepository(BookingReservation);
        this.standardDateRepository = AppDataSource.getRepository(StandardAvailableDate);
        this.adjustedDateRepository = AppDataSource.getRepository(AdjustedAvailableDate);
        this.roomRepository = AppDataSource.getRepository(Room);
    }
    //todo able to choose end date
    public async getThisWeeksAvailableReservationTimes(
        roomUUID: string
    ): Promise<AvailableReservationTimes> {
        const currentDate = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(currentDate.getDate() + 7);
        const roomWithAvailableTimes = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect(
                'room.adjustedDates',
                'adjustedDates',
                'adjustedDates.date BETWEEN :currentDate AND :oneWeekFromNow',
                {
                    currentDate,
                    oneWeekFromNow,
                }
            )
            .leftJoinAndSelect('adjustedDates.availabilityPeriods', 'adjustedAvailabilityPeriods')
            .leftJoinAndSelect(
                'room.standardDates',
                'standardDates',
                'NOT EXISTS (SELECT 1 FROM adjusted_available_date ad WHERE CAST(ad."dayOfWeek" AS VARCHAR) = CAST(standardDates.dayOfWeek AS VARCHAR) AND ad."roomUuid" = room.uuid)'
            )
            .leftJoinAndSelect('standardDates.availabilityPeriods', 'standardAvailabilityPeriods')
            .where('room.uuid = :roomUUID', { roomUUID })
            .getOne();

        if (roomWithAvailableTimes === null) {
            throw new EntityNotFound(errorMessages.rooms.notFound);
        }
        const availableReservationTimes = {
            roomUUID: roomWithAvailableTimes.uuid!,
            roomName: roomWithAvailableTimes.name!,
            availableTimes: [
                ...roomWithAvailableTimes.standardDates,
                ...roomWithAvailableTimes.adjustedDates,
            ],
        };

        return availableReservationTimes;
    }

    public async getAvailableReservationTimesByDay(
        roomUUID: string,
        dayOfWeek: DayOfWeek
    ): Promise<AvailableReservationTime> {
        const currentDate = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(currentDate.getDate() + 7);
        const roomWithAvailableTimes = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect(
                'room.adjustedDates',
                'adjustedDates',
                'adjustedDates.date BETWEEN :currentDate AND :oneWeekFromNow' +
                    ' AND ' +
                    'CAST(adjustedDates.dayOfWeek AS VARCHAR) = CAST(:dayOfWeek AS VARCHAR)',
                {
                    currentDate,
                    oneWeekFromNow,
                    dayOfWeek,
                }
            )
            .leftJoinAndSelect('adjustedDates.availabilityPeriods', 'adjustedAvailabilityPeriods')
            .leftJoinAndSelect(
                'room.standardDates',
                'standardDates',
                'CAST(standardDates.dayOfWeek AS VARCHAR) = CAST(:dayOfWeek AS VARCHAR)' +
                    ' AND ' +
                    'NOT EXISTS (SELECT 1 FROM adjusted_available_date ad WHERE CAST(ad."dayOfWeek" AS VARCHAR) = CAST(standardDates.dayOfWeek AS VARCHAR) AND ad."roomUuid" = room.uuid)',
                { dayOfWeek }
            )
            .leftJoinAndSelect('standardDates.availabilityPeriods', 'standardAvailabilityPeriods')
            .where('room.uuid = :roomUUID', { roomUUID })
            .getOne();

        if (roomWithAvailableTimes === null) {
            throw new EntityNotFound(errorMessages.rooms.notFound);
        }
        const availableTime: AdjustedAvailableDate | StandardAvailableDate | undefined =
            roomWithAvailableTimes.standardDates[0] || roomWithAvailableTimes.adjustedDates[0];

        const availableReservationTime: AvailableReservationTime = {
            roomUUID: roomWithAvailableTimes.uuid!,
            roomName: roomWithAvailableTimes.name!,
            availableTime: availableTime,
        };

        return availableReservationTime;
    }

    public async getBookingReservationByQuery(
        bookingReservationQuery: FindOptionsWhere<BookingReservation>[]
    ): Promise<BookingReservation | null> {
        return await this.bookingReservationRepository.findOne({
            where: bookingReservationQuery,
        });
    }

    public async getBookingReservationByUUID(
        bookingReservationUUID: string
    ): Promise<BookingReservation | null> {
        return await this.bookingReservationRepository.findOne({
            where: {
                uuid: Equal(bookingReservationUUID),
            },
        });
    }

    public async getBookingReservations(
        options: PaginationOptions,
        filter?: FindOptionsWhere<BookingReservation>[]
    ): Promise<Pagination<BookingReservation>> {
        const [data, total] = await this.bookingReservationRepository.findAndCount({
            where: filter,
            relations: {},
            take: options.limit,
            skip: options.page * options.limit,
        });
        return new Pagination<BookingReservation>({ data, total }, options);
    }

    public async createBookingReservation(
        userUUID: string,
        roomUUID: string,
        createBookingReservationInput: CreateBookingReservationInput
    ): Promise<BookingReservation> {
        //check if room does not exist
        const bookingDate = new Date(createBookingReservationInput.date); //date is validated in the controller layer
        const availableReservationTimes = await this.getAvailableReservationTimesByDay(
            roomUUID,
            bookingDate.getDay()
        );

        const availableTimeBlocks: TimeBlock[] | undefined =
            availableReservationTimes?.availableTime?.availabilityPeriods;

        if (
            !isTimeRangeAvailable(
                createBookingReservationInput.startTime,
                createBookingReservationInput.endTime,
                availableTimeBlocks
            )
        ) {
            throw new Conflict(errorMessages.bookings.notAvailable);
        }

        const isBookingToCreateOverlapping =
            await this.isGivenTimeBlockOverlappingWithExistingReservations(
                roomUUID,
                createBookingReservationInput.date as string,
                createBookingReservationInput.startTime,
                createBookingReservationInput.endTime
            );
        if (isBookingToCreateOverlapping) {
            throw new Conflict(errorMessages.bookings.bookingConflict);
        }

        const bookingReservationToCreate = new BookingReservation();
        bookingReservationToCreate.userUuid = userUUID;
        bookingReservationToCreate.roomUuid = roomUUID;
        bookingReservationToCreate.date = createBookingReservationInput.date as Date; //todo the last day of working in the backend and im doing stuff liek this becase i dont have time anymores
        bookingReservationToCreate.startTime = createBookingReservationInput.startTime;
        bookingReservationToCreate.endTime = createBookingReservationInput.endTime;
        return await this.bookingReservationRepository.save(bookingReservationToCreate);
    }

    private async isGivenTimeBlockOverlappingWithExistingReservations(
        roomUUID: string,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<boolean> {
        const overlappingReservation = await this.bookingReservationRepository
            .createQueryBuilder('reservation')
            .where('reservation.room.uuid = :roomUUID', { roomUUID })
            .andWhere('reservation.date = :date', { date })
            .andWhere(
                '((reservation.startTime <= :startTime AND reservation.endTime > :startTime) OR ' +
                    '(reservation.startTime < :endTime AND reservation.endTime >= :endTime) OR ' +
                    '(reservation.startTime >= :startTime AND reservation.endTime <= :endTime))',
                { startTime, endTime }
            )
            .getOne(); //one is enough
        return overlappingReservation !== null;
    }

    public async deleteBookingReservation(bookingReservationUUID: string): Promise<DeleteResult> {
        return await this.bookingReservationRepository.delete(bookingReservationUUID);
    }
}

export default BookingReservationDAO;
