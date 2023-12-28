import { Equal, Repository } from 'typeorm';
import { Role } from '@shared/entities/Role';
import { AppDataSource } from '@/data-source';

class RoleDAO {
    private roleRepository: Repository<Role>;

    constructor() {
        this.roleRepository = AppDataSource.getRepository(Role);
    }

    public async getRoleByRoleName(roleName: string) {
        const tenant = await this.roleRepository.findOne({
            where: { name: Equal(roleName) },
        });
        return tenant;
    }

    public async createRole(roleName: string) {
        const role = await this.getRoleByRoleName(roleName);
        if (role) {
            return role;
        }

        const roleToCreate = new Role();
        roleToCreate.name = roleName;
        return await this.roleRepository.save(roleToCreate);
    }
}

export default RoleDAO;
