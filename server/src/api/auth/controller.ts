import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import {
    Strategy as GoogleStrategy,
    VerifyCallback,
} from "passport-google-oauth2";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { IRequest, ResponseSender } from "../../utils/rest";
import AuthService from "./service";
import AuthValidator from "./validator";
import { OAuth2Client } from "google-auth-library";

let callbackUrl = "";

type PassportDoneFunction = (
    error: any,
    user?: false | Express.User | undefined,
    options?: IVerifyOptions | undefined
) => void;

export default class AuthController {
    JWT_SECRET: string = "";
    private googleClientId: string = "";
    private googleClientSecret: string = "";
    private host = "";
    private googleClient: OAuth2Client;

    validator: AuthValidator;
    service: AuthService;

    setEnvironmentParameters() {
        if (process.env.JWT_SECRET === undefined) {
            console.error("Missing environment parameter: JWT_SECRET");
            process.exit(1);
        }

        this.JWT_SECRET = process.env.JWT_SECRET;

        if (process.env.GOOGLE_CLIENT_ID === undefined) {
            console.error("Missing environment parameter: GOOGLE_CLIENT_ID");
            process.exit(1);
        }

        if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
            console.error(
                "Missing environment parameter: GOOGLE_CLIENT_SECRET"
            );
            process.exit(1);
        }

        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (process.env.HOST === undefined) {
            console.error("Missing environment parameter: HOST");
            process.exit(1);
        }

        this.host = process.env.HOST;
    }

    constructor() {
        this.validator = new AuthValidator();
        this.service = new AuthService();

        this.setEnvironmentParameters();

        this.googleClient = new OAuth2Client(this.googleClientId);

        passport.use(
            "login",
            new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password",
                },
                this.checkCredentials.bind(this)
            )
        );

        passport.use(
            new JwtStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: this.JWT_SECRET,
                },
                function (jwtPayload, cb) {
                    return cb(null, jwtPayload);
                }
            )
        );

        const callBackURL = `${this.host}/api/auth/google/callback`;
        callbackUrl = callBackURL;
        console.log("Google callback URL:", callBackURL);

        passport.use(
            new GoogleStrategy(
                {
                    clientID: this.googleClientId,
                    clientSecret: this.googleClientSecret,
                    callbackURL: callBackURL,
                    passReqToCallback: true,
                },
                // @ts-ignore
                this.verifyGoogle.bind(this)
            )
        );
    }

    async signup(
        req: IRequest<{
            email: string;
            username: string;
            password: string;
            repeatPassword: string;
        }>,
        res: Response,
        next: NextFunction
    ) {
        const validationResult = this.validator.signup(req.body);

        const response = new ResponseSender(res);
        if (validationResult.error) {
            console.log("Bad request: ", validationResult.error);
            return response.send400({
                message: validationResult.error.message,
            });
        }

        const result = await this.service.createUser({ ...req.body });

        if (result && result.error) {
            return response.send({
                status: result.error.status,
                message: result.error.message,
            });
        }

        if (result && result.user) {
            return response.send201({ message: "User created" });
        }
    }

    async checkCredentials(
        email: string,
        password: string,
        done: PassportDoneFunction
    ) {
        try {
            const validationResult = this.validator.login({
                email,
                password,
            });

            if (validationResult.error) {
                return done(null, false, {
                    message: validationResult.error.message,
                });
            }

            const result = await this.service.login(email, password);

            if (result.error) {
                return done(null, false, { ...result.error });
            }

            return done(null, result.user, {
                message: "Logged in Successfully",
            });
        } catch (error) {
            return done(error);
        }
    }

    sendToken(user: User, res: Response) {
        const response = new ResponseSender(res);

        const body = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        const token = jwt.sign({ user: body }, this.JWT_SECRET as string);
        return response.send({
            data: { token, user: body },
        });
    }

    async login(
        req: IRequest<{ email: string; password: string }>,
        res: Response,
        next: NextFunction
    ) {
        const response = new ResponseSender(res);

        passport.authenticate(
            "login",
            { session: false },
            (
                err: Error,
                user: User,
                info: { message: string; code: number }
            ) => {
                if (err) {
                    return response.send500({
                        message: info.message,
                    });
                }

                if (!user) {
                    return response.send404({
                        message: info.message,
                    });
                }

                req.login(user, { session: false }, async (error) => {
                    if (error)
                        return response.send500({
                            status: 500,
                            message: info.message,
                        });

                    this.sendToken(user, res);
                });
            }
        )(req, res);
    }

    async googleLogin(
        req: IRequest<{ credential: string }>,
        res: Response,
        next: NextFunction
    ) {
        // this.sendToken(req.user as User, res);
        // TODO: add redirect for react client

        console.log(req.body.credential);

        if (req.body.credential) {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: req.body.credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (payload && payload.email) {
                const email = payload.email;
                const firstName = payload.given_name;
                const lastName = payload.family_name;
                const imageURL = payload.picture;

                const { user } = await this.service.googleAuth(
                    email,
                    firstName,
                    lastName
                );

                if (user) {
                    return this.sendToken(user, res);
                }
            }

            return res.json({ payload });
        }

        res.send("Error");
    }

    async verifyGoogle(
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) {
        const email = profile.email;
        const firstName = profile.given_name;
        const lastName = profile.family_name;
        const imageURL = profile.photos[0]?.value;

        // TODO: save user image

        // find user or create
        const { user } = await this.service.googleAuth(
            email,
            firstName,
            lastName
        );

        return done(null, user);
    }
}
