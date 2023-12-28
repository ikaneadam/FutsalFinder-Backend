import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Host } from '@shared/entities/Host';
import { User } from '@shared/entities/User';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';

// Handling cases where a booked timeslot becomes unavailable:
// To address this scenario, an 'isCancelled' attribute has been introduced.
// When a timeslot is updated in such a way that it conflicts with an existing BookingReservation,
// resulting in the reservation no longer being feasible,
// the 'isCancelled' attribute for that timeslot is set to true.
// This change helps manage situations where timeslot availability changes post-booking.

//also added rescheduled for the same reason
@Entity()
export class BookingReservation extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => User, (user) => user.bookingReservations)
    user: User;

    @ManyToOne(() => Room, (room) => room.bookingReservations)
    room: Room;

    @Column({ type: 'float', default: 0 })
    cost: number;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @Column({ default: false })
    isRescheduled: boolean;

    @Column({ default: false })
    isCanceled: boolean;
}
