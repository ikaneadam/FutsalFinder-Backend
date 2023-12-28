import ISeeder from '@shared/interfaces/ISeeder';
import roleDAO from '@shared/dao/RoleDAO';
import RoleDAO from '@shared/dao/RoleDAO';
import { Roles } from '@shared/types/Roles';

class UserRoleSeeder extends ISeeder {
    private roleDao: roleDAO;
    public name = 'UserRoleSeeder'; //seeder names must be unique

    constructor() {
        super();
        this.roleDao = new RoleDAO();
    }

    async seed(): Promise<void> {
        await this.roleDao.createRole(Roles.user);
        await this.roleDao.createRole(Roles.host);
        await this.roleDao.createRole(Roles.admin);
    }
}

export default UserRoleSeeder;
