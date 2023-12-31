import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';

@Entity()
export class TimeBlock extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('time')
    startTime: string;

    @Column('time')
    endTime: string;

    @ManyToOne(() => AdjustedAvailableDate, (adjustedDate) => adjustedDate.availabilityPeriods)
    adjustedDate: AdjustedAvailableDate;

    @ManyToOne(() => StandardAvailableDate, (standardDate) => standardDate.availabilityPeriods)
    standardDate: StandardAvailableDate;
}
