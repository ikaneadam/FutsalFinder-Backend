import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Raw,
} from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Host } from '@shared/entities/Host';
import { User } from '@shared/entities/User';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';
import { AppDataSource } from '@/data-source';

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
    @JoinColumn({ name: 'roomUuid' })
    room: Room;

    @Column({ type: 'uuid', nullable: false })
    roomUuid: string;

    @Column({ type: 'float', default: 0 })
    cost: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column('time', { nullable: false })
    startTime: string;

    @Column('time', { nullable: false })
    endTime: string;

    @Column({ default: false })
    isRescheduled: boolean;

    @Column({ default: false })
    isCanceled: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async validateTimeSlot() {
        const repository = AppDataSource.getRepository(BookingReservation);

        const existingReservations = await repository.find({
            where: [
                {
                    room: { uuid: this.roomUuid },
                    date: this.date,
                    startTime: Raw((alias) => `${alias} < :endTime`, { endTime: this.endTime }),
                    endTime: Raw((alias) => `${alias} > :startTime`, { startTime: this.startTime }),
                    uuid: Raw((alias) => `${alias} <> :currentUUID`, { currentUUID: this.uuid }),
                },
                {
                    room: { uuid: this.roomUuid },
                    date: this.date,
                    uuid: Raw((alias) => `${alias} <> :currentUUID`, { currentUUID: this.uuid }),
                },
            ],
        });

        if (existingReservations.length > 0) {
            throw new Error('Overlapping time slots are not allowed');
        }
    }
}
