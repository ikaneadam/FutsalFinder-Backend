import { NextFunction, Request, Response } from 'express';
import { Mutex } from 'async-mutex';
const roomLocks = new Map();
export const lockRoom = async (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;
    let roomLock = roomLocks.get(roomId);

    if (!roomLock) {
        roomLock = new Mutex();
        roomLocks.set(roomId, roomLock);
    }

    res.on('finish', () => {
        roomLock.release();
    });
};
