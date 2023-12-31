import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';
import { DayOfWeek } from '@shared/entities/StandardAvailableDate';
import { Host } from '@shared/entities/Host';
// TODO IF WE CHANGE/ADD THIS THEN WE SHOULD CHECK IF THERE ALREADY RESERVATIONS AND CANCEL THOSE
@Entity()
@Index(['roomUuid', 'date'], { unique: true })
export class AdjustedAvailableDate extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @ManyToOne(() => Room, (room) => room.standardDates)
    @JoinColumn({ name: 'roomUuid' })
    room: Room;

    @Column({ type: 'uuid', nullable: true })
    roomUuid: string | null;

    @OneToMany(() => TimeBlock, (timeBlock) => timeBlock.adjustedDate, {
        cascade: true,
        eager: true,
    })
    availabilityPeriods: TimeBlock[];

    @BeforeInsert()
    @BeforeUpdate()
    updateDayOfWeek() {
        if (this.date) {
            const dayOfWeek = new Date(this.date).getDay();
            this.dayOfWeek = dayOfWeek;
        }
    }
}
