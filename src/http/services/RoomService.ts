import RoomDAO from '@shared/dao/RoomDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import { ParsedQs } from 'qs';
import { ExistenceResult } from '@shared/interfaces/EntitiyExist';
import { Pagination } from '@shared/pagination/pagination';
import { Room } from '@shared/entities/Room';
import * as Joi from 'joi';
import { validateCoordinate } from '@shared/utils/rest/ValidateSchema';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import { isAdminUser } from '@shared/types/Roles';
import entityNotFound from '@shared/exceptions/EntityNotFound';
import forbidden from '@shared/exceptions/Forbidden';
import errorMessages from '@shared/errorMessages';

class RoomService {
    private readonly roomDAO: RoomDAO;

    constructor() {
        this.roomDAO = new RoomDAO();
    }

    public async getRooms(
        paginationOptions: PaginationOptions,
        queryParams: ParsedQs
    ): Promise<Pagination<Room>> {
        const [isPresent, queries] = this.areLocationQueryParametersPresent(queryParams);
        if (isPresent) {
            return await this.roomDAO.getRoomsFindClosestBasedOnCoords(
                paginationOptions,
                queries.latitude,
                queries.longitude,
                queries.radius
            );
        }

        return await this.roomDAO.getRooms(paginationOptions);
    }

    private locationFilterSchema: Joi.Schema = Joi.object({
        longitude: Joi.number().custom(validateCoordinate, 'number.precision').required(),
        latitude: Joi.number().custom(validateCoordinate, 'number.precision').required(),
    }).unknown(true);

    private areLocationQueryParametersPresent(queries: ParsedQs): ExistenceResult<{
        longitude: number;
        latitude: number;
        radius: number | undefined;
    }> {
        const locationFilter: any = {
            longitude: Number(queries['longitude']),
            latitude: Number(queries['latitude']),
            ...(queries['radius'] !== undefined && { radius: Number(queries['radius']) }),
        };

        const { error } = this.locationFilterSchema.validate(locationFilter, { convert: false });
        if (error) {
            return [false, null];
        }

        return [true, locationFilter];
    }

    public isRoomOfUser(user: TAuthorizedUser, room: Room | undefined | null) {
        if (room === undefined || room === null) {
            throw new entityNotFound(errorMessages.rooms.notFound);
        }

        if (isAdminUser(user.roles)) {
            return true;
        }

        return room.doesRoomBelongToUser(user.hostId!);
    }

    public async isRoomOfUserByRoomUUID(
        user: TAuthorizedUser,
        roomId: string
    ): Promise<{ isRoomOfUser: boolean; room: Room }> {
        const room: Room | null = await this.roomDAO.getRoomByUUID(roomId);

        const doesRoomBelongToUser = this.isRoomOfUser(user, room);

        return { isRoomOfUser: doesRoomBelongToUser, room: room! };
    }

    public async handleRoomAuthorization(user: TAuthorizedUser, roomId: string): Promise<Room> {
        const { isRoomOfUser, room } = await this.isRoomOfUserByRoomUUID(user, roomId);
        if (!isRoomOfUser) {
            throw new forbidden();
        }
        return room;
    }
}

export default RoomService;
