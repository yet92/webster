import { PrismaClient, Project } from '@prisma/client';
import Database from '../../database';

export type CreateProjectParams = {
	thumbnail?: string;
	project: string;
	title: string;
	ownerId: number;
};

export type ProjectsServiceMethodReturns = {
	project?: Project;
	error?: { status: number; message: string };
	projects?: Project[];
};

export default class ProjectsService {
	private prisma: PrismaClient = Database.client();

	async createProject({
		project,
		ownerId,
		title,
		thumbnail,
	}: CreateProjectParams): Promise<ProjectsServiceMethodReturns> {
		try {
			console.log('asfsafsaf', ownerId);
			const newProject = await this.prisma.project.create({
				data: {
					project,
					ownerId,
					title,
					thumbnail,
				},
			});

			return { project: newProject };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}

	async retrieveOne({
		projectId,
	}: {
		projectId: number;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const project = await this.prisma.project.findFirst({
				where: { id: projectId },
			});

			if (!project)
				return {
					error: { message: 'No project with such id', status: 404 },
				};

			return { project };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}
	async retrieveAll({
		userId,
	}: {
		userId: number;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const projects = await this.prisma.project.findMany({
				where: { ownerId: userId },
			});
			return { projects };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}
}