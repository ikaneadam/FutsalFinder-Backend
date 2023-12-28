import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';

@Entity()
export class AdjustedReservationDate extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => Room, (room) => room.standardDates)
    room: Room;

    @OneToMany(() => TimeBlock, (timeBlock) => timeBlock.adjustedDate)
    availabilityPeriods: TimeBlock[];
}
