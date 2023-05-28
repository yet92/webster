import { PrismaClient, User } from '@prisma/client';
import Database from '../../database';

export type UsersServiceMethodReturns = {
	user?: User;
	error?: { status: number; message: string };
	users?: User[];
};

export default class ProjectsService {
	private prisma: PrismaClient = Database.client();

	async retrieveOne({
		userId,
	}: {
		userId: number;
	}): Promise<UsersServiceMethodReturns> {
		try {
			const user = await this.prisma.user.findFirst({
				where: { id: userId },
			});

			if (!user)
				return {
					error: { message: 'No user with such id', status: 404 },
				};

			return { user };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}
	async retrieveAll(): Promise<UsersServiceMethodReturns> {
		try {
			const users = await this.prisma.user.findMany({
			});
			return { users };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}
}
