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
    private readonly geoCodingServiceURL = `${process.env.GOOGLE_GEO_API_URL}`;
    private readonly geoCodingApiKey = `${process.env.GOOLE_GEO_API_KEY}`;
    private readonly geoForwardURL = `${this.geoCodingServiceURL}/maps/api/geocode/json`;


    constructor() {
        this.httpService = new HttpService();
    }

    public async getAddressFromGeoForward(
        geoForwardInput: GeoForwardInput
    ): Promise<GeoForwardSuccessResponse> {
        //access key should be done else where but no time
        const geoForwardRequestURL = this.createGeoForwardRequestURl(geoForwardInput)

        const geoLocationResponse = await this.httpService.doRequest<
            GeoForwardSuccessResponse,
            GeoForwardErrorResponse
        >(HttpMethod.GET, geoForwardRequestURL);
        if (isHttpResponseSuccessful(geoLocationResponse)) {
            return geoLocationResponse.response;
        }

        throw new InternalServerError(errorMessages.common.notAvailable);
    }

    private createGeoForwardRequestURl(geoInput: GeoForwardInput): string {
        const geoAddressQuery= this.parseGeoForwardInputToQueryParam(geoInput)

        const componentFilterQueryString = `country:NL|postal_code=${geoInput.zip}`
        //&components=${componentFilterQueryString}
        const geoForwardRequestFullUrl = `${this.geoForwardURL}?address=${geoAddressQuery}&key=${this.geoCodingApiKey}`;

        return geoForwardRequestFullUrl;
    }

    private parseGeoForwardInputToQueryParam(geoInput: GeoForwardInput): string {
        const { street, houseNumber, zip, state, city } = geoInput;

        const queryString = encodeURIComponent(
            `${street},${houseNumber},${zip},${state},${city}`
        );

        return queryString;
    }
}

export default GeoService;
