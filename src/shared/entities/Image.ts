import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Host } from '@shared/entities/Host';
import { Room } from '@shared/entities/Room';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    url: string;
}
