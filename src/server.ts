import BackendApp from './backendApp';
import cors from 'cors';
import express from 'express';

import dotenv from 'dotenv';

import UserView from '@views/UserView';
import HostView from '@views/HostView';
import AddressView from '@views/AddressView';
import RoomView from '@views/RoomView';
import StandardDateView from '@views/StandardDateView';
import AdjustedDateView from '@views/AdjustedDateView';
import BookingReservationView from '@views/BookingReservationView';
import AutoCompletionView from '@views/AutoCompletionView';

dotenv.config();

const server = new BackendApp({
    port: process.env.PORT || 3000,
    middleWares: [cors(), express.json(), express.urlencoded({ extended: true })],
    views: [
        new UserView(),
        new HostView(),
        new AddressView(),
        new RoomView(),
        new StandardDateView(),
        new AdjustedDateView(),
        new BookingReservationView(),
        new AutoCompletionView(),
    ],
});

server.listen();
