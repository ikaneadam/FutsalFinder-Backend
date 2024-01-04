import StandardDateDAO from '@shared/dao/StandardDateDAO';
import errorMessages from '@shared/errorMessages';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import { Room } from '@shared/entities/Room';
import forbidden from '@shared/exceptions/Forbidden';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { StandardAvailableDate } from '@shared/entities/StandardAvailableDate';
import { isAdminUser } from '@shared/types/Roles';

class StandardDateService {
    private readonly standardDateDAO: StandardDateDAO;

    constructor() {
        this.standardDateDAO = new StandardDateDAO();
    }

    public async handleStandardDateAuthorization(
        user: TAuthorizedUser,
        roomId: string,
        standardDateId: string
    ): Promise<StandardAvailableDate> {
        const standardDate = await this.standardDateDAO.getStandardDateByRoomAndDateId(
            roomId,
            standardDateId
        );
        console.log(standardDate);
        if (standardDate === null) {
            throw new EntityNotFound();
        }

        if (isAdminUser(user.roles)) {
            return standardDate;
        }

        const doesDateBelongToUser = standardDate?.room.doesRoomBelongToUser(user.hostId!);

        if (!doesDateBelongToUser) {
            throw new forbidden();
        }
        return standardDate;
    }
}

export default StandardDateService;
