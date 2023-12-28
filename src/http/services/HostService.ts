import HostDAO from '@shared/dao/HostDAO';
import errorMessages from '@shared/errorMessages';

class HostService {
    private readonly hostDAO: HostDAO;

    constructor() {
        this.hostDAO = new HostDAO();
    }
}

export default HostService;
