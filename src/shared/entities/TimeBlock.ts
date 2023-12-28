import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { AdjustedReservationDate } from './AdjustedReservationDate';
import { StandardReservationDate } from './StandardReservationDate';

@Entity()
export class TimeBlock extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @ManyToOne(() => AdjustedReservationDate, (adjustedDate) => adjustedDate.availabilityPeriods)
    adjustedDate: AdjustedReservationDate;

    @ManyToOne(() => StandardReservationDate, (standardDate) => standardDate.availabilityPeriods)
    standardDate: StandardReservationDate;
}
