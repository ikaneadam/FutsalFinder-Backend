import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { BookingReservation } from './BookingReservation';
import { StandardReservationDate } from '@shared/entities/StandardReservationDate';
import { AdjustedReservationDate } from '@shared/entities/AdjustedReservationDate';
import { Host } from '@shared/entities/Host';
import { Address } from '@shared/entities/Address';
import { Image } from '@shared/entities/Image';

@Entity()
export class Room extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    name: string | undefined | null;

    @Column({ type: 'text', unique: false })
    description: string | undefined | null;

    @Column({ type: 'float' })
    hourlyRate: number | undefined | null;

    @OneToOne(() => Address, { cascade: true })
    @JoinColumn()
    address: Address;

    @ManyToMany(() => Image)
    @JoinTable()
    images: Image[];

    @ManyToOne(() => Host, (host) => host.rooms)
    host: Host;

    @OneToMany(() => BookingReservation, (bookingReservation) => bookingReservation.room)
    bookingReservations: BookingReservation[];

    @OneToMany(() => StandardReservationDate, (standardDate) => standardDate.room)
    standardDates: StandardReservationDate[];

    @OneToMany(() => AdjustedReservationDate, (adjustedDate) => adjustedDate.room)
    adjustedDates: AdjustedReservationDate[];

    //TYPEORM HACK TO INCLUDE IN GET MANY INSTEAD OF RAW
    // cheated with this one: https://github.com/typeorm/typeorm/issues/1822
    @Column('float', {
        nullable: true,
        select: false,
    })
    distance: number;
}
