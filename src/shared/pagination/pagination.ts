import { PaginationResult } from './pagination.results';
import { PaginationOptions } from './pagination.options';
import { ParamsDictionary } from 'express-serve-static-core';
import QueryString from 'qs';

export class Pagination<PaginationEntity> {
    private data: PaginationEntity[];
    private nextPage: string;
    private previousPage: string;
    private hasNextPage: boolean;
    private hasPreviousPage: boolean;
    private lastPage: number;
    private totalRecords: number;

    private getLastPage(total: number, limit: number): number {
        const lastPage = Math.ceil(total / limit);
        if (lastPage === 0) {
            return lastPage;
        }
        return lastPage - 1;
    }

    private getPaginatedPageUrl(
        url: { parameters: QueryString.ParsedQs; url: string },
        page: number,
        limit: number
    ) {
        return `${
            url.url
        }?page=${page}&limit=${limit}&${this.parseParametersToQueryString(
            url.parameters
        )}`;
    }

    private parseParametersToQueryString(parameters: QueryString.ParsedQs) {
        const parsedParameters: ParamsDictionary = {};
        Object.keys(parameters).forEach((key: string) => {
            if (key !== 'page' && key !== 'limit') {
                parsedParameters[key] = <string>parameters[key];
            }
        });
        return QueryString.stringify(parsedParameters);
    }

    constructor(
        paginationResults: PaginationResult<PaginationEntity>,
        paginationOptions: PaginationOptions
    ) {
        this.data = paginationResults.data;
        this.nextPage = this.getPaginatedPageUrl(
            paginationOptions.url,
            paginationOptions.page + 1,
            paginationOptions.limit
        );

        this.previousPage = this.getPaginatedPageUrl(
            paginationOptions.url,
            paginationOptions.page <= 0 ? 0 : paginationOptions.page - 1,
            paginationOptions.limit
        );

        if (paginationOptions.isExternalData) {
            return;
        }
        this.totalRecords = paginationResults.total;
        const lastPage = this.getLastPage(
            paginationResults.total,
            paginationOptions.limit
        );

        this.hasNextPage = paginationOptions.page < lastPage;
        this.hasPreviousPage =
            paginationOptions.page > 0 && paginationOptions.page <= lastPage;
        this.lastPage = lastPage;
    }

    public getData() {
        return this.data;
    }

    public getHasNextPage() {
        return this.hasNextPage;
    }

    public getHasPreviousPage() {
        return this.hasPreviousPage;
    }
}
