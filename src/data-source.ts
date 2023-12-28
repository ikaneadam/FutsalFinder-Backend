import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { TimeBlock } from '@shared/entities/TimeBlock';
import { StandardReservationDate } from '@shared/entities/StandardReservationDate';
import { AdjustedReservationDate } from '@shared/entities/AdjustedReservationDate';
import { Host } from '@shared/entities/Host';
import { Role } from '@shared/entities/Role';
import { User } from '@shared/entities/User';
import { Room } from '@shared/entities/Room';
import { BookingReservation } from '@shared/entities/BookingReservation';
import { Seed } from '@shared/entities/Seed';
import { Address } from '@shared/entities/Address';
import { Image } from '@shared/entities/Image';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: String(process.env.DB_HOST),
    username: String(process.env.POSTGRES_USERNAME),
    password: String(process.env.POSTGRES_PASSWORD),
    database: String(process.env.POSTGRES_DB),
    port: Number(process.env.POSTGRES_PORT),
    synchronize: true,
    logging: false,
    entities: [
        Role,
        User,
        TimeBlock,
        StandardReservationDate,
        AdjustedReservationDate,
        Room,
        Host,
        BookingReservation,
        Seed,
        Address,
        Image,
    ],
});
