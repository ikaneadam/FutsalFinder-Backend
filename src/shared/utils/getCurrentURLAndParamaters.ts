import { Request } from 'express';
export const getCurrentURLAndParamaters = (req: Request) => {
    return {url: req.protocol + '://' + req.get('host') + req.path, parameters: req.query };
};
