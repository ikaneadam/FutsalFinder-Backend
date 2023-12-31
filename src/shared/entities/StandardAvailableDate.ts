import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';

export enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
}

// TODO IF WE CHANGE THIS THEN WE SHOULD CHECK IF THERE ALREADY RESERVATIONS AND CANCEL THOSE
@Entity()
export class StandardAvailableDate extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'enum', enum: DayOfWeek, unique: true })
    dayOfWeek: DayOfWeek;

    @ManyToOne(() => Room, (room) => room.standardDates, { cascade: ['update'] })
    room: Room;

    //todo remove timeblock as enitity
    @OneToMany(() => TimeBlock, (timeBlock) => timeBlock.standardDate, {
        cascade: true,
        eager: true,
    })
    availabilityPeriods: TimeBlock[];
}
