import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';

@Entity()
export class Seed extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;
}
