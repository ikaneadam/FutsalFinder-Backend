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
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
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

    @ManyToMany(() => Image, { cascade: true })
    @JoinTable()
    images: Image[];

    @ManyToOne(() => Host, (host) => host.rooms)
    @JoinColumn({ name: 'hostUuid' })
    host: Host;

    @Column({ type: 'uuid', nullable: true })
    hostUuid: string | null;

    @OneToMany(() => BookingReservation, (bookingReservation) => bookingReservation.room)
    bookingReservations: BookingReservation[];

    @OneToMany(() => StandardAvailableDate, (standardDate) => standardDate.room)
    standardDates: StandardAvailableDate[];

    @OneToMany(() => AdjustedAvailableDate, (adjustedDate) => adjustedDate.room)
    adjustedDates: AdjustedAvailableDate[];

    //TYPEORM HACK TO INCLUDE IN GET MANY INSTEAD OF RAW
    // cheated with this one: https://github.com/typeorm/typeorm/issues/1822
    @Column('float', {
        nullable: true,
        select: false,
    })
    distance: number;

    doesRoomBelongToUser(userHostId: string) {
        return this.hostUuid === userHostId;
    }
}
