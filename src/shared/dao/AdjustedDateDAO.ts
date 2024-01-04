import { Equal, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { Room } from '@shared/entities/Room';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
import {
    CreateAdjustedDateInput,
    UpdateAdjustedDateInput,
} from '@shared/types/Dates/AdjustedDate/AdjustedDateInput';

class AdjustedDateDAO {
    private adjustedDateRepository: Repository<AdjustedAvailableDate>;

    constructor() {
        this.adjustedDateRepository = AppDataSource.getRepository(AdjustedAvailableDate);
    }

    public async doesAdjustedDateExist(
        adjustedDateUUID: string
    ): Promise<ExistenceResult<AdjustedAvailableDate>> {
        const findAdjustedDateQueries: FindOptionsWhere<AdjustedAvailableDate>[] = [
            {
                uuid: Equal(adjustedDateUUID),
            },
        ];

        const foundAdjustedDate = await this.getAdjustedDateByQuery(findAdjustedDateQueries);
        return parseEntityToExistenceResult<AdjustedAvailableDate>(foundAdjustedDate);
    }

    public async getAdjustedDateByQuery(
        adjustedDateQuery: FindOptionsWhere<AdjustedAvailableDate>[]
    ): Promise<AdjustedAvailableDate | null> {
        return await this.adjustedDateRepository.findOne({
            where: adjustedDateQuery,
        });
    }

    public async getAdjustedDateByUUID(
        adjustedDateUUID: string
    ): Promise<AdjustedAvailableDate | null> {
        return await this.adjustedDateRepository.findOne({
            where: {
                uuid: Equal(adjustedDateUUID),
            },
        });
    }

    public async getAdjustedDateByRoomAndDateId(
        roomId: string,
        adjustedDateUUID: string
    ): Promise<AdjustedAvailableDate | null> {
        return await this.adjustedDateRepository.findOne({
            where: {
                uuid: Equal(adjustedDateUUID),
                room: {
                    uuid: Equal(roomId),
                },
            },
            relations: {
                availabilityPeriods: true,
                room: true,
            },
        });
    }

    public async getAdjustedDates(
        roomId: string,
        options: PaginationOptions
    ): Promise<Pagination<AdjustedAvailableDate>> {
        const [data, total] = await this.adjustedDateRepository.findAndCount({
            where: {
                room: {
                    uuid: Equal(roomId),
                },
            },
            relations: {
                availabilityPeriods: true,
            },
            take: options.limit,
            skip: options.page * options.limit,
        });
        return new Pagination<AdjustedAvailableDate>({ data, total }, options);
    }

    public async createAdjustedDate(
        room: Room,
        createAdjustedDateInput: CreateAdjustedDateInput
    ): Promise<AdjustedAvailableDate> {
        const adjustedDateToCreate = new AdjustedAvailableDate();
        adjustedDateToCreate.room = room;
        updateEntity<AdjustedAvailableDate>(adjustedDateToCreate, createAdjustedDateInput);
        return await this.adjustedDateRepository.save(adjustedDateToCreate);
    }

    public async updateAdjustedDate(
        adjustedDateToUpdate: AdjustedAvailableDate,
        updateAdjustedDateInput: UpdateAdjustedDateInput
    ): Promise<AdjustedAvailableDate> {
        if (adjustedDateToUpdate === null) {
            throw new EntityNotFound();
        }
        updateEntity<AdjustedAvailableDate>(adjustedDateToUpdate, updateAdjustedDateInput);
        return await this.adjustedDateRepository.save(adjustedDateToUpdate);
    }

    public async deleteAdjustedDate(adjustedDateUUID: string): Promise<UpdateResult> {
        return await this.adjustedDateRepository.softDelete(adjustedDateUUID);
    }
}

export default AdjustedDateDAO;
