import { Request } from 'express';
import { PaginationOptions } from './pagination.options';
import { getCurrentURLAndParamaters } from '../../../../../concept7/connections-api/src/shared/utils/getCurrentURLAndParamaters';

class BuildPaginationOptionsFromQueryParameters {
    private static defaultPage = 0;
    private static defaultLimit = 20;

    public static buildPaginationOptionsFromQueryParameters = async (
        req: Request,
        isExternalData: boolean = false
    ): Promise<PaginationOptions> => {
        const limit = req.query.limit;
        const page = req.query.page;
        return {
            limit: this.parseParameter(limit, this.defaultLimit),
            page: this.parseParameter(page, this.defaultPage),
            isExternalData: isExternalData,
            url: getCurrentURLAndParamaters(req),
        };
    };

    private static parseParameter(parameter: any, defaultSize: number): number {
        if (parameter === undefined) {
            return defaultSize;
        }

        parameter = Number(parameter);

        if (isNaN(parameter)) {
            return defaultSize;
        }

        if (parameter <= 0) {
            return defaultSize;
        }

        return parameter;
    }
}

export default BuildPaginationOptionsFromQueryParameters;
