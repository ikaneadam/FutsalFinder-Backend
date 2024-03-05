import { BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class ExtendedBaseEntity extends BaseEntity {
    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        select: false,
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        nullable: true,
        default: null,
        select: false,
    })
    deletedAt!: Date;
}
