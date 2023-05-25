import { PrismaClient, Prisma, User } from "@prisma/client";
import Database from "../../database";
import * as crypto from "crypto";

export type CreateUserParams = {
    email: string;
    username: string;
    password: string;
};

export type AuthServiceMethodReturns = {
    user?: User;
    error?: { status: number; message: string };
};

export default class AuthService {
    private prisma: PrismaClient = Database.client();

    private HASH_ITERATIONS = 310000;

    private hashPassword(password: string, salt?: Buffer) {
        if (!salt) salt = crypto.randomBytes(16);
        const hashed = crypto.pbkdf2Sync(
            password,
            salt,
            this.HASH_ITERATIONS,
            32,
            "sha256"
        );
        return { salt, hashed };
    }

    private isPasswordCorrect(password: string, user: User) {
        let result = false;
        if (user.salt && user.password) {
            const salt = Buffer.from(user.salt, "hex");
            const { hashed } = this.hashPassword(password, salt);
            console.log(
                hashed.length,
                Buffer.from(user.password, "hex").length
            );
            result = crypto.timingSafeEqual(
                Buffer.from(user.password, "hex"),
                hashed
            );
        }

        return result;
    }

    async createUser({
        email,
        username,
        password,
    }: CreateUserParams): Promise<AuthServiceMethodReturns> {
        const { hashed: hashedPassword, salt } = this.hashPassword(password);

        try {
            const checkUser = await this.prisma.user.findFirst({
                where: {
                    OR: [{ email }, { username }],
                },
            });

            if (checkUser) {
                return {
                    error: {
                        status: 400,
                        message:
                            "User with such email, username or both already exists",
                    },
                };
            }

            const user = await this.prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword.toString("hex"),
                    salt: salt.toString("hex"),
                },
            });

            return { user };
        } catch (error) {
            return { error: { message: "Something went wrong", status: 500 } };
        }
    }

    async login(
        email: string,
        password: string
    ): Promise<AuthServiceMethodReturns> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            return { error: { message: "User not found", status: 404 } };
        }

        if (!this.isPasswordCorrect(password, user)) {
            return { error: { message: "User not found", status: 400 } };
        }

        return { user };
    }

    async googleAuth(
        email: string,
        firstName?: string,
        lastName?: string
    ): Promise<AuthServiceMethodReturns> {
        let user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    password: "",
                    firstName,
                    lastName,
                },
            });
        }

        return { user };
    }
}
