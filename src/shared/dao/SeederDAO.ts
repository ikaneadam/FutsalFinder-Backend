import { Equal, Repository } from 'typeorm';
import { Seed } from '@shared/entities/Seed';
import { AppDataSource } from '@/data-source';

class SeederDAO {
    private seederRepository: Repository<Seed>;

    constructor() {
        this.seederRepository = AppDataSource.getRepository(Seed);
    }

    public async hasSeederAlreadyRan(seederName: string): Promise<boolean> {
        const seed = await this.seederRepository.findOne({
            where: { name: Equal(seederName) },
        });
        return seed !== null;
    }

    public async saveSeeder(seederName: string) {
        const seed = new Seed();
        seed.name = seederName;
        await this.seederRepository.save(seed);
    }
}

export default SeederDAO;
