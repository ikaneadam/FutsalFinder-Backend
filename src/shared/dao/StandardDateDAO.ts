import { Equal, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';
import {
    CreateStandardDateInput,
    UpdateStandardDateInput,
} from '@shared/types/Dates/StandardDate/StandardDateInput';
import { Room } from '@shared/entities/Room';

class StandardDateDAO {
    private standardDateRepository: Repository<StandardAvailableDate>;

    constructor() {
        this.standardDateRepository = AppDataSource.getRepository(StandardAvailableDate);
    }

    public async doesStandardDateExist(
        standardDateUUID: string
    ): Promise<ExistenceResult<StandardAvailableDate>> {
        const findStandardDateQueries: FindOptionsWhere<StandardAvailableDate>[] = [
            {
                uuid: Equal(standardDateUUID),
            },
        ];

        const foundStandardDate = await this.getStandardDateByQuery(findStandardDateQueries);
        return parseEntityToExistenceResult<StandardAvailableDate>(foundStandardDate);
    }

    public async getStandardDateByQuery(
        standardDateQuery: FindOptionsWhere<StandardAvailableDate>[]
    ): Promise<StandardAvailableDate | null> {
        return await this.standardDateRepository.findOne({
            where: standardDateQuery,
        });
    }

    public async getStandardDateByUUID(
        standardDateUUID: string
    ): Promise<StandardAvailableDate | null> {
        return await this.standardDateRepository.findOne({
            where: {
                uuid: Equal(standardDateUUID),
            },
        });
    }

    public async getStandardDateByRoomAndDateId(
        roomId: string,
        standardDateUUID: string
    ): Promise<StandardAvailableDate | null> {
        return await this.standardDateRepository.findOne({
            where: {
                uuid: Equal(standardDateUUID),
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

    public async getStandardDates(
        roomId: string,
        options: PaginationOptions
    ): Promise<Pagination<StandardAvailableDate>> {
        const [data, total] = await this.standardDateRepository.findAndCount({
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
        return new Pagination<StandardAvailableDate>({ data, total }, options);
    }

    public async createStandardDate(
        room: Room,
        createStandardDateInput: CreateStandardDateInput
    ): Promise<StandardAvailableDate> {
        const standardDateToCreate = new StandardAvailableDate();
        standardDateToCreate.room = room;
        updateEntity<StandardAvailableDate>(standardDateToCreate, createStandardDateInput);
        return await this.standardDateRepository.save(standardDateToCreate);
    }

    public async updateStandardDate(
        standardDateToUpdate: StandardAvailableDate,
        updateStandardDateInput: UpdateStandardDateInput
    ): Promise<StandardAvailableDate> {
        if (standardDateToUpdate === null) {
            throw new EntityNotFound();
        }
        updateEntity<StandardAvailableDate>(standardDateToUpdate, updateStandardDateInput);
        return await this.standardDateRepository.save(standardDateToUpdate);
    }

    public async deleteStandardDate(standardDateUUID: string): Promise<UpdateResult> {
        return await this.standardDateRepository.softDelete(standardDateUUID);
    }
}

export default StandardDateDAO;
