import {IController, IRequest, ResponseSender} from "@utils/rest";
import {NextFunction, Router, Response} from "express";
import AuthValidator from "./validator";
import AuthService from "./service";

export default class AuthController implements IController {

    validator: AuthValidator;
    service: AuthService;

    constructor() {
        this.validator = new AuthValidator();
        this.service = new AuthService();
    }

    setup(router: Router): void {
        router.post('/credentials/signup', this.signup.bind(this));
    }

    async signup(req: IRequest<{ email: string, username: string, password: string, repeatPassword: string }>,
                 res: Response, next: NextFunction) {
        const validationResult = this.validator.signup(req.body);

        const response = new ResponseSender(res);
        if (validationResult.error) {
            console.log('Bad request: ', validationResult.error);
            return response.send400({message: validationResult.error.message});
        }

        // create user
        const result = await this.service.createUser({...req.body})
        // if user already exists - send error
        if (result && result.error) {
            response.send400({message: result.error});
        }
        // else send 201
        if (result && result.user) {
            console.log('User created');
            response.send201({message: 'User created'});
        }


    }


}