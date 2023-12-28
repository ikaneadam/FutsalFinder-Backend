import UserDAO from '@shared/dao/UserDAO';
import BadRequest from '@shared/exceptions/BadRequest';
import errorMessages from '@shared/errorMessages';
import { generateToken } from '@shared/service/AuthenticationService';
import { UserCreateInput, UserLoginInput } from '@shared/types/users/UserAuth';
import { Roles } from '@shared/types/Roles';

class UserService {
    private readonly userDAO: UserDAO;

    constructor() {
        this.userDAO = new UserDAO();
    }

    public async login(user: UserLoginInput) {
        const [userExist, userToLogin] = await this.userDAO.doesUserExist(user.username, true);

        if (!userExist) {
            throw new BadRequest(errorMessages.auth.userNameNotFound);
        }

        const isPasswordValid = await userToLogin?.validatePassword(user.password);

        if (!isPasswordValid) {
            throw new BadRequest(errorMessages.auth.invalidCredentials);
        }

        const refreshedToken = await generateToken(userToLogin!);

        return refreshedToken;
    }

    public async registerDefaultUser(user: UserCreateInput) {
        //Password length is already checked in the controller layer but we shoudl check it here also if a other function wants to use its
        const [userExist, userToLogin] = await this.userDAO.doesUserExist(
            user.username,
            false,
            user.email
        );

        if (userExist) {
            throw new BadRequest(errorMessages.auth.userAlreadyExist);
        }
        //set to default user role
        user.role = Roles.user;
        const registeredUser = await this.userDAO.createUser(user);

        const refreshedToken = await generateToken(registeredUser);

        return refreshedToken;
    }
}

export default UserService;
