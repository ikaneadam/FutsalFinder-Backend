import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '@/data-source';
import { ExistenceResult, parseEntityToExistenceResult } from '@shared/interfaces/EntitiyExist';
import { User } from '@shared/entities/User';
import { UserCreateInput } from '@shared/types/users/UserAuth';
import RoleDAO from '@shared/dao/RoleDAO';

class UserDAO {
    private userRepository: Repository<User>;
    private roleDAO: RoleDAO;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.roleDAO = new RoleDAO();
    }

    public async doesUserExist(
        username: string,
        includePassword: boolean,
        email?: string
    ): Promise<ExistenceResult<User>> {
        const findUserQueries: FindOptionsWhere<User>[] = [
            {
                username: Equal(username),
            },
        ];
        if (email) {
            const findEmailQuery = {
                email: Equal(email),
            };
            findUserQueries.push(findEmailQuery);
        }

        const foundUser = await this.getUserByQuery(findUserQueries, includePassword);
        return parseEntityToExistenceResult<User>(foundUser);
    }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({
            relations: {
                roles: true,
            },
            where: {
                username: Equal(username),
            },
        });
    }

    public async getUserByQuery(
        userQuery: FindOptionsWhere<User>[],
        includePassword: boolean = false
    ): Promise<User | null> {
        const select: (keyof User)[] = ['uuid', 'username', 'email', 'host'];

        if (includePassword) {
            select.push('password');
        }

        return await this.userRepository.findOne({
            relations: {
                roles: true,
            },
            where: userQuery,
            select: select,
        });
    }

    public async createUser(user: UserCreateInput): Promise<User> {
        // maybe we should cache the roles
        // so we dont have to ask the db every time
        const role = await this.roleDAO.getRoleByRoleName(user.role);
        if (role === null) {
            throw new Error();
        }
        const userToCreate = new User();
        userToCreate.username = user.username;
        userToCreate.email = user.email;
        await userToCreate.setPassword(user.password);
        await userToCreate.addRole(role);
        return this.userRepository.save(userToCreate);
    }
}

export default UserDAO;
