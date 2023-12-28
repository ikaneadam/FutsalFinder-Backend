import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from '@shared/interfaces/ExtendedBaseEntity';

@Entity()
export class Address extends ExtendedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    street: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    houseNumber: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    city: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    state: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    zip: string;

    @Column({ type: 'varchar', length: 255, unique: false })
    country: string;

    @Column({ type: 'double precision', nullable: true })
    latitude: number;

    @Column({ type: 'double precision', nullable: true })
    longitude: number;
}
