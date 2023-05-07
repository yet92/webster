import { PrismaClient } from "@prisma/client";

export default class Database {
    private static _client: PrismaClient | null = null;

    static client() {
        if (!Database._client) Database._client = new PrismaClient();
        return Database._client;
    }
}
