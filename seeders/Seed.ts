import { AppDataSource } from '@/data-source';
import SeederDAO from '@shared/dao/SeederDAO';
import ISeeder from '@shared/interfaces/ISeeder';
import UserRoleSeeder from './UserRoleSeeder';

const seederDAO = new SeederDAO();

const seeders: ISeeder[] = [new UserRoleSeeder()];

const initializeDatabase = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize().catch((error) => {
            console.log(error);
        });
    }
};

initializeDatabase().then(async () => {
    for (const seeder of seeders) {
        if (await seederDAO.hasSeederAlreadyRan(seeder.name)) {
            continue;
        }
        console.log(`Running seeder: ${seeder.name}`);
        seeder.seed().then(async () => {
            await seederDAO.saveSeeder(seeder.name);
        });
    }
});
