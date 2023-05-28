import { NextFunction, Response } from 'express';

import { IRequest, ResponseSender } from '../../utils/rest';
import ProjectsService from './service';
import ProjectValidator from './validator';

let callbackUrl = '';

export default class ProjectsController {
	validator: ProjectValidator;
	service: ProjectsService;

	constructor() {
		this.validator = new ProjectValidator();
		this.service = new ProjectsService();
	}

	async create(
		req: IRequest<{
			title: string;
			project: string;
			thumbnail?: string;
		}>,
		res: Response,
		next: NextFunction
	) {
		const validationResult = this.validator.create(req.body);

		const response = new ResponseSender(res);

		if (validationResult.error) {
			console.log('Bad request: ', validationResult.error);
			return response.send400({
				message: validationResult.error.message,
			});
		}
		const result = await this.service.createProject({
			...req.body,
			ownerId: req.user!.user!.id,
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.project) {
			return response.send201({
				message: 'Project created',
				data: result.project,
			});
		}
	}
	async retrieveAll(req: IRequest<{}>, res: Response, next: NextFunction) {
		const response = new ResponseSender(res);

		const result = await this.service.retrieveAll({
			...req.body,
			userId:  req.user!.user!.id,
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.projects) {
			return response.send({
				message: 'Projects retrieved',
				data: result.projects,
			});
		}
	}

	async retrieveOne(
		req: IRequest<{
			id: string;
		}>,
		res: Response,
		next: NextFunction
	) {
		const response = new ResponseSender(res);

		const result = await this.service.retrieveOne({
			projectId: parseInt(req.body.id),
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.projects) {
			return response.send({
				message: 'Projects retrieved',
				data: result.projects,
			});
		}
	}
}