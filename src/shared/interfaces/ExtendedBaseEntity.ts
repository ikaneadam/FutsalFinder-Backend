import { BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class ExtendedBaseEntity extends BaseEntity {
    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        type: 'timestamptz',
        nullable: true,
        default: null,
    })
    deletedAt!: Date;
}
