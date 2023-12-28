import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';

enum DayOfWeek {
    Sunday = 'sunday',
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
}

@Entity()
export class StandardReservationDate extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'enum', enum: DayOfWeek, unique: true })
    dayOfWeek: DayOfWeek;

    @ManyToOne(() => Room, (room) => room.standardDates)
    room: Room;

    @OneToMany(() => TimeBlock, (timeBlock) => timeBlock.standardDate)
    availabilityPeriods: TimeBlock[];
}
