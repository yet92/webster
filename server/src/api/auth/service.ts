import {PrismaClient, Prisma } from "@prisma/client";
import Database from "@database/*";
import * as crypto from "crypto";

export type CreateUserParams = {
    email: string,
    username: string,
    password: string
}
export default class AuthService {

    private prisma: PrismaClient = Database.client();

    private HASH_ITERATIONS = 310000;

    async createUser({email, username, password}: CreateUserParams) {

        const salt = crypto.randomBytes(16);

        const hashedPassword = crypto.pbkdf2Sync(password, salt, this.HASH_ITERATIONS, 32, 'sha256');

        try {

            const checkUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        {email},
                        {username}
                    ]
                }
            });

            if (checkUser) {
                return {error: 'Email and username must be unique'}
            }

            const user = await this.prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword.toString()
                }
            });

            return {user};

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.log(error.meta);
                console.log(error.code);
            }
            return {error};
        }


    }

}