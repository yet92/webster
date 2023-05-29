import { PrismaClient, Project } from '@prisma/client';
import Database from '../../database';
import { Server } from "socket.io";
import { ServerIO } from '../../sockets';

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
	private io = ServerIO.get();

	async createProject({
		project,
		ownerId,
		title,
		thumbnail,
	}: CreateProjectParams): Promise<ProjectsServiceMethodReturns> {
		try {
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

	async addToCollection({
		collectionId,
		projectId,
	}: {
		collectionId: number;
		projectId: number;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const newProject = await this.prisma.project.update({
				where: { id: projectId },
				data: { collectionId: collectionId },
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

	async addItem({ projectId, newItem, userId }: { projectId: number; newItem: any, userId: string }) {
		const { project } = await this.retrieveOne({ projectId });

		const items = JSON.parse(project!.project);
		items[0].data.push(newItem);

		const newProject = JSON.stringify(items);

		console.log("User ID", userId);

		this.io.to(String(projectId)).emit('createItem', { from: userId, type: 'create', item: newItem });

		await this.prisma.project.update({
			where: {
				id: projectId,
			},
			data: {
				project: newProject,
			},
		});

		return { project: { ...project, project: newProject } };
	}

	async updateItem({
		projectId,
		updatedObject,
		userId
	}: {
		projectId: number;
		updatedObject: any;
		userId: string
	}) {
		const { project } = await this.retrieveOne({ projectId });

		const items = JSON.parse(project!.project);

		const item = items[0].data.find(
			(item: { id: number }) => item.id === updatedObject.id
		);


		for (const key in item) {
			item[key] = updatedObject[key];
		}

		this.io.to(String(projectId)).emit('updateItem', { from: userId, item });

		const updatedProject = JSON.stringify(items);

		await this.prisma.project.update({
			where: {
				id: projectId,
			},
			data: {
				project: updatedProject,
			},
		});

		return { project: { ...project, project: updatedProject } };
	}

	async removeItem({
		projectId,
		updatedObjectId,
		userId
	}: {
		projectId: number;
		updatedObjectId: string;
		userId: string
	}) {
		const { project } = await this.retrieveOne({ projectId });

		let projectArray = JSON.parse(project!.project);

		projectArray[0].data = projectArray[0].data.filter(
			(item: { id: string }) => item.id !== updatedObjectId
		);

		this.io.to(String(projectId)).emit('removeItem', { from: userId, itemId: updatedObjectId });

		const updatedProject = JSON.stringify(projectArray);

		await this.prisma.project.update({
			where: {
				id: projectId,
			},
			data: {
				project: updatedProject,
			},
		});

		return { project: { ...project, project: updatedProject } };
	}

	async removeItems({
		projectId,
		updatedObjectIds,
		userId
	}: {
		projectId: number;
		updatedObjectIds: string[];
		userId: string
	}) {
		const { project } = await this.retrieveOne({ projectId });

		let projectArray = JSON.parse(project!.project);

		projectArray[0].data = projectArray[0].data.filter((item: { id: string }) =>
			!updatedObjectIds.includes(item.id)
		);
		const updatedProject = JSON.stringify(projectArray);

		this.io.to(String(projectId)).emit('removeItem', { from: userId, itemId: updatedObjectIds });

		await this.prisma.project.update({
			where: {
				id: projectId,
			},
			data: {
				project: updatedProject,
			},
		});

		return { project: { ...project, project: updatedProject } };
	}

	async changeIsPublic({
		projectId,
		isPublic,
	}: {
		projectId: number;
		isPublic: boolean;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const project = await this.prisma.project.update({
				where: { id: projectId },
				data: { isPublic },
			});

			if (!project)
				return {
					error: { message: 'No project with such id', status: 404 },
				};

			return {};
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}

	async removeOne({
		projectId,
	}: {
		projectId: number;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const project = await this.prisma.project.delete({
				where: { id: projectId },
			});

			if (!project)
				return {
					error: { message: 'No project with such id', status: 404 },
				};

			return {};
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}

	async removeFromCollection({
		projectId,
	}: {
		projectId: number;
	}): Promise<ProjectsServiceMethodReturns> {
		try {
			const newProject = await this.prisma.project.update({
				where: { id: projectId },
				data: { collectionId: null },
			});

			return { project: newProject };
		} catch (error) {
			console.error(error);
			return { error: { message: 'Something went wrong', status: 500 } };
		}
	}
}
