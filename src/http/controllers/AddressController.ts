import { Request, Response } from 'express';
import * as Joi from 'joi';
import { validateSchema } from '@shared/utils/rest/ValidateSchema';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import GeoService from '@shared/service/GeoService';

class AddressController {
    private readonly geoService: GeoService;
    constructor() {
        this.geoService = new GeoService();
    }
    //todo better address validation so we can minimise external api usage
    private getAddressSchema: Joi.Schema = Joi.object({
        street: Joi.string().min(2).max(40).required(),
        houseNumber: Joi.string().min(1).max(40).required(),
        zip: Joi.string().min(2).max(40).required(),
        state: Joi.string().min(2).max(40).required(),
        city: Joi.string().min(2).max(40).required(),
    });

    public getAddress = async (req: Request, res: Response) => {
        try {
            validateSchema(this.getAddressSchema, req.body);
            const getAddressQuery = this.geoService.parseGeoForwardInputToQueryParam(req.body);
            const foundAddresses = await this.geoService.getAddressFromGeoForward(getAddressQuery);

            return res.status(200).json(foundAddresses);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    private getAddressQuerySchema: Joi.Schema = Joi.object({
        query: Joi.string().min(2).max(255).required(),
    });

    public getAddressQuery = async (req: Request, res: Response) => {
        try {
            validateSchema(this.getAddressQuerySchema, req.body);
            const getAddressQuery = req.body.query;
            const foundAddresses = await this.geoService.getAddressFromGeoForward(getAddressQuery);

            return res.status(200).json(foundAddresses);
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default AddressController;
