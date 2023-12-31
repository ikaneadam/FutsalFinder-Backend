import { TAuthorizedUser } from '@shared/middleware/Auth';
import forbidden from '@shared/exceptions/Forbidden';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import { isAdminUser } from '@shared/types/Roles';
import { AdjustedAvailableDate } from '@shared/entities/AdjustedAvailableDate';
import AdjustedDateDAO from '@shared/dao/AdjustedDateDAO';

class AdjustedDateService {
    private readonly adjustedDateDAO: AdjustedDateDAO;

    constructor() {
        this.adjustedDateDAO = new AdjustedDateDAO();
    }

    public async handleAdjustedDateAuthorization(
        user: TAuthorizedUser,
        roomId: string,
        adjustedDateId: string
    ): Promise<AdjustedAvailableDate> {
        const adjustedDate = await this.adjustedDateDAO.getAdjustedDateByRoomAndDateId(
            roomId,
            adjustedDateId
        );

        if (adjustedDate === null) {
            throw new EntityNotFound();
        }

        if (isAdminUser(user.roles)) {
            return adjustedDate;
        }

        const doesDateBelongToUser = adjustedDate?.room.doesRoomBelongToUser(user.hostId!);

        if (!doesDateBelongToUser) {
            throw new forbidden();
        }
        return adjustedDate;
    }
}

export default AdjustedDateService;
