import { Collection, PrismaClient } from "@prisma/client";
import Database from "../../database";

export type CreateCollectionParams = {
  thumbnail?: string;
  title: string;
  ownerId: number;
};

export type CollectionsServiceMethodReturns = {
  collection?: Collection;
  error?: { status: number; message: string };
  collections?: Collection[];
};

export default class ProjectsService {
  private prisma: PrismaClient = Database.client();

  async createCollection({
    ownerId,
    title,
    thumbnail,
  }: CreateCollectionParams): Promise<CollectionsServiceMethodReturns> {
    try {
      console.log("asfsafsaf", ownerId);
      const newCollection = await this.prisma.collection.create({
        data: {
          ownerId,
          title,
          ...(thumbnail && { thumbnail }),
          // thumbnail
        },
      });

      return { collection: newCollection };
    } catch (error) {
      console.error(error);
      return { error: { message: "Something went wrong", status: 500 } };
    }
  }

  async retrieveOne({ collectionId }: { collectionId: number }): Promise<CollectionsServiceMethodReturns> {
    try {
      const collection = await this.prisma.collection.findFirst({
        where: { id: collectionId },
        include: { projects: true },
      });

      if (!collection)
        return {
          error: { message: "No collection with such id", status: 404 },
        };

      return { collection };
    } catch (error) {
      console.error(error);
      return { error: { message: "Something went wrong", status: 500 } };
    }
  }

  async removeOne({ collectionId }: { collectionId: number }): Promise<CollectionsServiceMethodReturns> {
    try {
      const collection = await this.prisma.collection.delete({
        where: { id: collectionId },
      });

      if (!collection)
        return {
          error: { message: "No collection with such id", status: 404 },
        };

      return { collection };
    } catch (error) {
      console.error(error);
      return { error: { message: "Something went wrong", status: 500 } };
    }
  }

  async retrieveAll({ userId }: { userId: number }): Promise<CollectionsServiceMethodReturns> {
    try {
      const collections = await this.prisma.collection.findMany({
        where: { ownerId: userId },
      });
      return { collections };
    } catch (error) {
      console.error(error);
      return { error: { message: "Something went wrong", status: 500 } };
    }
  }
}
