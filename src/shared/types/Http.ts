import { Err } from 'joi';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
}

export enum HttpResponseErrorType {
    Success = 0,
    Error,
    UnknownError,
}

//shit typescript.
export function isHttpResponseSuccessful<T, K>(
    httpResponse: HttpResponse<T, K>
): httpResponse is SuccessResponse<T> {
    return httpResponse.status.message === HttpResponseErrorType.Success;
}

// export function isHttpResponseUnSuccessful<T, K>(
//     httpResponse: HttpResponse<T, K>
// ): httpResponse is ErrorResponse<K> {
//     return httpResponse.status.message === HttpResponseErrorType.Error;
// }

export type HttpResponse<successType, errorType> =
    | ErrorResponse<errorType>
    | SuccessResponse<successType>;

export type SuccessResponse<T> = {
    status: { statusCode: number; message: HttpResponseErrorType.Success };
    response: T;
};
export type ErrorResponse<T> = SpecificErrorResponse<T> | GeneralErrorResponse;

export type SpecificErrorResponse<T> = {
    status: { statusCode: number; message: HttpResponseErrorType.Error };
    response: T;
};

export type GeneralErrorResponse = {
    status: { message: HttpResponseErrorType.UnknownError };
    error: Error;
};
