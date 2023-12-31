import { Equal, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { User } from '@shared/entities/User';
import { Host } from '@shared/entities/Host';
import { CreateHostInput, UpdateHostInput } from '@shared/types/hosts/hostInput';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import errorMessages from '@shared/errorMessages';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import { Image } from '@shared/entities/Image';
import { multerImage } from '@shared/types/common';

class HostDAO {
    private hostRepository: Repository<Host>;

    constructor() {
        this.hostRepository = AppDataSource.getRepository(Host);
    }

    public async doesHostExist(hostUUID: string): Promise<ExistenceResult<Host>> {
        const findHostQueries: FindOptionsWhere<User>[] = [
            {
                uuid: Equal(hostUUID),
            },
        ];

        const foundHost = await this.getHostByQuery(findHostQueries);
        return parseEntityToExistenceResult<Host>(foundHost);
    }

    public async getHostByQuery(hostQuery: FindOptionsWhere<Host>[]): Promise<Host | null> {
        return await this.hostRepository.findOne({
            relations: {
                rooms: true,
            },
            where: hostQuery,
        });
    }

    public async getHostByUUID(hostUUID: string): Promise<Host | null> {
        return await this.hostRepository.findOne({
            relations: {
                rooms: true,
                images: true,
            },
            where: {
                uuid: Equal(hostUUID),
            },
        });
    }

    public async getHosts(
        options: PaginationOptions,
        filter?: FindOptionsWhere<Host>[]
    ): Promise<Pagination<Host>> {
        const [data, total] = await this.hostRepository.findAndCount({
            where: filter,
            relations: {
                rooms: true,
                images: true,
            },
            take: options.limit,
            skip: options.page * options.limit,
        });
        return new Pagination<Host>({ data, total }, options);
    }

    //freaking multer
    public async setHostImages(hostUUID: string, imagesToSet: multerImage[]) {
        const hostToUpdate = await this.getHostByUUID(hostUUID);
        if (hostToUpdate === null) {
            throw new EntityNotFound();
        }

        const hanna = imagesToSet.map((imageToSet: multerImage) => {
            const newImage = new Image();
            newImage.fileName = imageToSet.filename;
            return newImage;
        });
        hostToUpdate.images = hanna;
        return await this.hostRepository.save(hostToUpdate);
    }

    public async createHost(createHostInput: CreateHostInput): Promise<Host> {
        const hostToCreate = new Host();
        hostToCreate.name = createHostInput.name;
        hostToCreate.description = createHostInput.description;
        hostToCreate.phoneNumber = createHostInput.phoneNumber;
        hostToCreate.iban = createHostInput.iban;
        hostToCreate.description = createHostInput.description;
        hostToCreate.email = createHostInput.email;
        return await this.hostRepository.save(hostToCreate);
    }

    public async updateHost(hostUUID: string, updateHostInput: UpdateHostInput): Promise<Host> {
        const hostToUpdate = await this.getHostByUUID(hostUUID);
        if (hostToUpdate === null) {
            throw new EntityNotFound();
        }
        updateEntity<Host>(hostToUpdate, updateHostInput);
        return await this.hostRepository.save(hostToUpdate);
    }

    public async deleteHost(hostUUID: string): Promise<UpdateResult> {
        return await this.hostRepository.softDelete(hostUUID);
    }
}

export default HostDAO;
