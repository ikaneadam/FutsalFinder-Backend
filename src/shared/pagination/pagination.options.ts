import QueryString from 'qs';

export interface PaginationOptions {
    limit: number;
    page: number;
    isExternalData: boolean;
    url: { parameters: QueryString.ParsedQs; url: string };
}
