import axios, { AxiosInstance } from 'axios';
import {
    ErrorResponse,
    HttpMethod,
    HttpResponse,
    HttpResponseErrorType,
    SpecificErrorResponse,
} from '@shared/types/Http';
import { keyValuePair } from '@shared/types/common';
import e from 'express';

class HttpService {
    public async doRequest<successType, errorType>(
        method: HttpMethod,
        url: string,
        headers?: keyValuePair<string>,
        body?: any
    ): Promise<HttpResponse<successType, errorType>> {
        try {
            const response = await axios({
                method: method,
                url: url,
                data: body,
                headers: headers as any,
                validateStatus: () => true,
            });

            if (this.isErrorResponseCode(response.status)) {
                return {
                    status: { statusCode: response.status, message: HttpResponseErrorType.Error },
                    response: response.data,
                };
            }

            return {
                status: { statusCode: response.status, message: HttpResponseErrorType.Success },
                response: response.data,
            };
        } catch (e: any) {
            return { status: { message: HttpResponseErrorType.UnknownError }, error: e };
        }
    }

    private isErrorResponseCode(code: number) {
        return code >= 400;
    }
}

export default HttpService;
