import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Host } from '@shared/entities/Host';
import { Role } from '@shared/entities/Role';
import { BookingReservation } from './BookingReservation';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password?: string;

    // only for specific type of users
    @ManyToOne(() => Host, (host) => host.users)
    host?: Host;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable()
    roles?: Role[];

    @OneToMany(() => BookingReservation, (bookingReservation) => bookingReservation.user)
    bookingReservations: BookingReservation[];

    async addRole(role: Role) {
        if (this.roles === undefined) {
            this.roles = [role];
            return;
        }
        this.roles.push(role);
    }

    async setPassword(password: string): Promise<void> {
        const roundOfSalts = 8;
        this.password = await bcrypt.hash(password, roundOfSalts);
    }

    async validatePassword(unencryptedPassword: string): Promise<boolean> {
        return bcrypt.compare(unencryptedPassword, this.password!);
    }
}
