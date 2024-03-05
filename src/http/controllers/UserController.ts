import { Request, Response } from 'express';
import * as Joi from 'joi';
import { handleRestExceptions } from '@shared/HandleRestExceptions';
import UserService from '@services/UserService';
import { validateSchema } from '@shared/utils/rest/ValidateSchema';

class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    private loginSchema: Joi.Schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(5).max(255).required(),
    });

    public refreshToken = async (req: Request, res: Response) => {
        try {
            validateSchema(this.loginSchema, req.body);

            const refreshedToken = await this.userService.login(req.body);

            return res.status(200).json({ token: refreshedToken });
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };

    private registerSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().required(),
    });

    public createUser = async (req: Request, res: Response) => {
        try {
            validateSchema(this.registerSchema, req.body);

            const userToken = await this.userService.registerDefaultUser(req.body);

            return res.status(200).json({ token: userToken });
        } catch (e: any) {
            handleRestExceptions(e, res);
        }
    };
}

export default UserController;
