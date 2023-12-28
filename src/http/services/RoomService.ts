import RoomDAO from '@shared/dao/RoomDAO';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import { ParsedQs } from 'qs';
import { ExistenceResult } from '@shared/interfaces/EntitiyExist';
import { Pagination } from '@shared/pagination/pagination';
import { Room } from '@shared/entities/Room';
import * as Joi from 'joi';
import { validateCoordinate } from '@shared/utils/ValidateSchema';

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
        radius: Joi.number().min(0).required(),
    });

    private areLocationQueryParametersPresent(queries: ParsedQs): ExistenceResult<{
        longitude: number;
        latitude: number;
        radius: number;
    }> {
        const locationFilter: any = {
            longitude: Number(queries['longitude']),
            latitude: Number(queries['latitude']),
            radius: Number(queries['radius']),
        };

        const { error } = this.locationFilterSchema.validate(locationFilter, { convert: false });
        if (error) {
            return [false, null];
        }

        return [true, locationFilter];
    }
}

export default RoomService;
