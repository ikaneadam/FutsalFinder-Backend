import { NextFunction, Request, Response } from 'express';
import { TAuthorizedUser } from '@shared/middleware/Auth';
import { isAdminUser } from '@shared/types/Roles';
import ValidationError from '@shared/exceptions/ValidationError';
import Unauthorized from '@shared/exceptions/Unauthorized';
import Forbidden from '@shared/exceptions/Forbidden';
import HostDAO from '@shared/dao/HostDAO';
import EntityNotFound from '@shared/exceptions/EntityNotFound';
import ErrorMessages from '@shared/errorMessages';
import { handleRestExceptions } from '@shared/HandleRestExceptions';

const hostDAO = new HostDAO();

export const ExtractHost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostId = getHostIdFromParams(req);
        const [hostExist, host] = await hostDAO.doesHostExist(hostId);
        if (!hostExist) {
            throw new EntityNotFound(ErrorMessages.hosts.notFound);
        }
        req.hostId = hostId;
        req.extractedHost = host;

        next();
    } catch (e) {
        handleRestExceptions(e, res);
    }
};

export const getHostIdFromParams = (
    req: Request,
    paramsHostId: string | undefined = req.params.hostId
): string => {
    if (req.user === undefined) throw new Unauthorized();
    const user: TAuthorizedUser = req.user;
    const isHostIdUndefined = paramsHostId === undefined;
    const doesHostBelongToGivenHostId = paramsHostId === req.user.hostId;

    if (isAdminUser(user.roles)) {
        if (isHostIdUndefined) {
            throw new ValidationError(ErrorMessages.hosts.noIdProvided);
        }
        return paramsHostId;
    }

    if (isHostIdUndefined) {
        return user.hostId!;
    }

    if (!doesHostBelongToGivenHostId) {
        throw new Forbidden();
    }
    return user.hostId!;
};
