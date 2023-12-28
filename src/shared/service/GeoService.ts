import {
    GeoForwardErrorResponse,
    GeoForwardInput,
    GeoForwardSuccessResponse,
} from '@shared/types/geoLocation/GeoFoward';
import HttpService from '@shared/service/HttpService';
import { HttpMethod, HttpResponseErrorType, isHttpResponseSuccessful } from '@shared/types/Http';
import dotenv from 'dotenv';
import InternalServerError from '@shared/exceptions/InternalServerError';
import errorMessages from '@shared/errorMessages';

dotenv.config();
class GeoService {
    private readonly httpService: HttpService;
    private readonly geoCodingServiceURL = `${process.env.POSITION_STACK_API_URL}`;
    private readonly geoCodingApiKey = `${process.env.POSITION_STACK_API_KEY}`;
    private readonly geoForwardURL = `${this.geoCodingServiceURL}/v1/forward`;

    constructor() {
        this.httpService = new HttpService();
    }

    public async getAddressFromGeoForward(
        geoForwardInput: GeoForwardInput
    ): Promise<GeoForwardSuccessResponse> {
        const geoForwardInputQueryParameters =
            this.parseGeoForwardInputToQueryParam(geoForwardInput);
        //access key should be done else where but no time
        const geoForwardRequestURL = `${this.geoForwardURL}?${geoForwardInputQueryParameters}&access_key=${this.geoCodingApiKey}`;
        const geoLocationResponse = await this.httpService.doRequest<
            GeoForwardSuccessResponse,
            GeoForwardErrorResponse
        >(HttpMethod.GET, geoForwardRequestURL);
        if (isHttpResponseSuccessful(geoLocationResponse)) {
            return geoLocationResponse.response;
        }

        throw new InternalServerError(errorMessages.common.notAvailable);
    }

    private parseGeoForwardInputToQueryParam(geoInput: GeoForwardInput): string {
        const { street, houseNumber, zip, state, city } = geoInput;

        const encodedQueryString = encodeURIComponent(
            `${street},${houseNumber},${zip},${state},${city}`
        );

        const queryString = `query=${encodedQueryString}&country=NL&region=${encodeURIComponent(
            city
        )}`;

        return queryString;
    }
}

export default GeoService;
