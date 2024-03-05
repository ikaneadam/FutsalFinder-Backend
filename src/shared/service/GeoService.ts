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
import { AutocompleteResponse } from '@shared/types/geoLocation/AddressPrediction';

dotenv.config();
class GeoService {
    private readonly httpService: HttpService;
    private readonly geoCodingServiceURL = `${process.env.GOOGLE_GEO_API_URL}`;
    private readonly geoCodingApiKey = `${process.env.GOOLE_GEO_API_KEY}`;
    private readonly geoForwardURL = `${this.geoCodingServiceURL}/maps/api/geocode/json`;
    private readonly addressAutoCompleteUrl = `${this.geoCodingServiceURL}/maps/api/place/autocomplete/json`;

    constructor() {
        this.httpService = new HttpService();
    }

    public async getAddressFromGeoForward(
        geoAddressQuery: string
    ): Promise<GeoForwardSuccessResponse> {
        const geoForwardRequestURL = this.createGeoForwardRequestURl(geoAddressQuery);

        const geoLocationResponse = await this.httpService.doRequest<
            GeoForwardSuccessResponse,
            GeoForwardErrorResponse
        >(HttpMethod.GET, geoForwardRequestURL);
        if (isHttpResponseSuccessful(geoLocationResponse)) {
            return geoLocationResponse.response;
        }

        throw new InternalServerError(errorMessages.common.notAvailable);
    }

    public async getAddressPredictions(geoAddressQuery: string): Promise<AutocompleteResponse> {
        const geoForwardRequestURL = this.createPlaceAutoCompleteUrl(geoAddressQuery);
        const predictionResponses = await this.httpService.doRequest<AutocompleteResponse, any>(
            HttpMethod.GET,
            geoForwardRequestURL
        );
        if (isHttpResponseSuccessful(predictionResponses)) {
            return predictionResponses.response;
        }

        throw new InternalServerError(errorMessages.common.notAvailable);
    }

    private createPlaceAutoCompleteUrl(addressQuery: string) {
        return `${this.addressAutoCompleteUrl}?input=${addressQuery}&language=NL&key=${this.geoCodingApiKey}`;
    }

    private createGeoForwardRequestURl(addressQuery: string): string {
        const geoForwardRequestFullUrl = `${this.geoForwardURL}?address=${addressQuery}&key=${this.geoCodingApiKey}`;
        return geoForwardRequestFullUrl;
    }

    public parseGeoForwardInputToQueryParam(geoInput: GeoForwardInput): string {
        const { street, houseNumber, zip, state, city } = geoInput;

        const queryString = encodeURIComponent(`${street},${houseNumber},${zip},${state},${city}`);

        return queryString;
    }
}

export default GeoService;
