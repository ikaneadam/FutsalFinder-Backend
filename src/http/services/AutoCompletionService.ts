import HostDAO from '@shared/dao/HostDAO';
import GeoService from '@shared/service/GeoService';

class AutoCompletionService {
    private readonly geoService: GeoService;
    private count = 0;
    constructor() {
        this.geoService = new GeoService();
    }

    public async getPredictionsBasedOnSearchQuery(query: string | undefined) {
        if (query === undefined || query.length < 3) {
            return {
                predictions: [],
                status: 'ZERO_RESULTS',
            };
        }

        const geoForwardAddresses = await this.geoService.getAddressPredictions(query);
        console.log('jij gaat veel belaten vriend', this.count);
        this.count = this.count + 1;
        return geoForwardAddresses;
    }
}

export default AutoCompletionService;
