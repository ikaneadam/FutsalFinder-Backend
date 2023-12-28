import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';
import { User } from '@shared/entities/User';

@Entity()
export class Role extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
