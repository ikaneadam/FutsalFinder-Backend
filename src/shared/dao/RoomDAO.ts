import { Equal, FindOptionsWhere, getManager, OneToMany, Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { Room } from '@shared/entities/Room';
import { updateEntity } from '@shared/utils/UpdateEntity';
import { Pagination } from '@shared/pagination/pagination';
import { PaginationOptions } from '@shared/pagination/pagination.options';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { CreateRoomInput, UpdateRoomInput } from '@shared/types/rooms/roomInput';
import { Address } from '@shared/entities/Address';
import HostDAO from '@shared/dao/HostDAO';
import entityNotFound from '@shared/exceptions/EntityNotFound';
import errorMessages from '@shared/errorMessages';
import { Multer } from 'multer';
import { multerImage } from '@shared/types/common';
import { Image } from '@shared/entities/Image';
import { BookingReservation } from '@shared/entities/BookingReservation';
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';

class RoomDAO {
    private roomRepository: Repository<Room>;
    private hostDAO: HostDAO;

    constructor() {
        this.roomRepository = AppDataSource.getRepository(Room);
        this.hostDAO = new HostDAO();
    }

    public async doesRoomExist(roomUUID: string): Promise<ExistenceResult<Room>> {
        const findRoomQueries: FindOptionsWhere<Room>[] = [
            {
                uuid: Equal(roomUUID),
            },
        ];

        const foundRoom = await this.getRoomByQuery(findRoomQueries);
        return parseEntityToExistenceResult<Room>(foundRoom);
    }

    public async getRoomByQuery(roomQuery: FindOptionsWhere<Room>[]): Promise<Room | null> {
        return await this.roomRepository.findOne({
            where: roomQuery,
        });
    }

    public async getRoomByUUID(roomUUID: string): Promise<Room | null> {
        return await this.roomRepository.findOne({
            relations: {
                address: true,
                images: true,
                host: true,
            },
            where: {
                uuid: Equal(roomUUID),
            },
        });
    }

    public async getRooms(
        options: PaginationOptions,
        filter?: FindOptionsWhere<Room>[]
    ): Promise<Pagination<Room>> {
        const [data, total] = await this.roomRepository.findAndCount({
            where: filter,
            relations: {
                address: true,
                images: true,
            },
            take: options.limit,
            skip: options.page * options.limit,
        });
        return new Pagination<Room>({ data, total }, options);
    }

    //freaking multer
    public async setRoomImages(roomUUID: string, imagesToSet: multerImage[]) {
        const roomToUpdate = await this.getRoomByUUID(roomUUID);
        if (roomToUpdate === null) {
            throw new EntityNotFound();
        }

        const hanna = imagesToSet.map((imageToSet: multerImage) => {
            const newImage = new Image();
            newImage.fileName = imageToSet.filename;
            return newImage;
        });
        roomToUpdate.images = hanna;
        return await this.roomRepository.save(roomToUpdate);
    }

    public async getRoomsFindClosestBasedOnCoords(
        options: PaginationOptions,
        userLatitude: number,
        userLongitude: number,
        radius: number | undefined
    ): Promise<Pagination<Room>> {
        const calculateEarthDistanceInMeters = `
                            earth_distance(
                                ll_to_earth(:userLatitude::double precision, :userLongitude::double precision),
                                ll_to_earth(address.latitude::double precision, address.longitude::double precision)
                            ) 
                            `;

        const [data, total] = await this.roomRepository
            .createQueryBuilder('room')
            .innerJoinAndSelect('room.address', 'address')
            .leftJoinAndSelect('room.images', 'images')
            .addSelect(calculateEarthDistanceInMeters, 'room_distance')
            .where(radius !== undefined ? `${calculateEarthDistanceInMeters} < :radius` : '1=1', {
                radius,
            })
            .orderBy('room_distance', 'ASC')
            .setParameter('userLatitude', userLatitude)
            .setParameter('userLongitude', userLongitude)
            .setParameter('radius', radius)
            .skip(options.page * options.limit)
            .take(options.limit)
            .getManyAndCount();

        return new Pagination<Room>({ data, total }, options);
    }

    public async createRoom(createRoomInput: CreateRoomInput, hostId: string): Promise<Room> {
        //todo use updateEntitiy<Room>() here
        const addressRoomInput = createRoomInput.address;
        const addressToCreate = new Address();
        addressToCreate.city = addressRoomInput.city;
        addressToCreate.country = 'Netherlands'; //todo multi countries
        addressToCreate.zip = addressRoomInput.zip;
        addressToCreate.houseNumber = addressRoomInput.houseNumber;
        addressToCreate.state = addressRoomInput.state;
        addressToCreate.street = addressRoomInput.street;
        addressToCreate.longitude = addressRoomInput.longitude;
        addressToCreate.latitude = addressRoomInput.latitude;
        const roomToCreate = new Room();
        roomToCreate.address = addressToCreate;
        const host = await this.hostDAO.getHostByUUID(hostId);
        if (!host) {
            throw new entityNotFound(errorMessages.hosts.notFound);
        }
        roomToCreate.host = host;
        roomToCreate.description = createRoomInput.description;
        roomToCreate.name = createRoomInput.name;
        roomToCreate.hourlyRate = createRoomInput.hourlyRate;

        return await this.roomRepository.save(roomToCreate);
    }

    public async updateRoom(roomUUID: string, updateRoomInput: UpdateRoomInput): Promise<Room> {
        const roomToUpdate = await this.getRoomByUUID(roomUUID);
        if (roomToUpdate === null) {
            throw new EntityNotFound();
        }
        updateEntity<Room>(roomToUpdate, updateRoomInput);
        return await this.roomRepository.save(roomToUpdate);
    }

    public async deleteRoom(roomUUID: string): Promise<UpdateResult> {
        return await this.roomRepository.softDelete(roomUUID);
    }
}

export default RoomDAO;
