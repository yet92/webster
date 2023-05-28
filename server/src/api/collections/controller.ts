import { NextFunction, Response } from 'express';

import { IRequest, ResponseSender } from '../../utils/rest';
import CollectionsService from './service';
import CollectionsValidator from './validator';

let callbackUrl = '';

export default class CollectionController {
	validator: CollectionsValidator;
	service: CollectionsService;

	constructor() {
		this.validator = new CollectionsValidator();
		this.service = new CollectionsService();
	}

	async create(
		req: IRequest<{
			title: string;
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
		const result = await this.service.createCollection({
			...req.body,
			ownerId: req.user!.user!.id,
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.collection) {
			return response.send201({
				message: 'Collection created',
				data: result.collection,
			});
		}
	}
	async retrieveAll(req: IRequest<{}>, res: Response, next: NextFunction) {
		const response = new ResponseSender(res);

		const result = await this.service.retrieveAll({
			userId:  req.user!.user!.id,
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.collections) {
			return response.send({
				message: 'Collections retrieved',
				data: result.collections,
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
			collectionId: parseInt(req.params.id),
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.collection) {
			return response.send({
				message: 'Collection retrieved',
				data: result.collection,
			});
		}
	}
}
