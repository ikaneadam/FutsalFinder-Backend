import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { User } from '@shared/entities/User';
import { BookingReservation } from '@shared/entities/BookingReservation';
import { Room } from '@shared/entities/Room';
import { TimeBlock } from '@shared/entities/TimeBlock';
import { Address } from '@shared/entities/Address';
import { Image } from '@shared/entities/Image';

@Entity()
export class Host extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @OneToMany(() => User, (user) => user.host)
    users: User[];

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true, unique: false })
    description: string | null | undefined;

    @OneToMany(() => Room, (room) => room.host)
    rooms: Room[];

    @ManyToMany(() => Image, { cascade: true })
    @JoinTable()
    images: Image[];

    @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
    iban: string | null | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
    phoneNumber: string | null | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true, unique: false })
    email: string | null | undefined;
}
