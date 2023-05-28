import { NextFunction, Response } from 'express';

import { IRequest, ResponseSender } from '../../utils/rest';
import UsersService from './service';

let callbackUrl = '';

export default class UsersController {
	service: UsersService;

	constructor() {
		this.service = new UsersService();
	}

	async retrieveAll(req: IRequest<{}>, res: Response, next: NextFunction) {
		const response = new ResponseSender(res);

		const result = await this.service.retrieveAll();

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.users) {
			return response.send({
				message: 'Users retrieved',
				data: result.users,
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
			userId: parseInt(req.params.id),
		});

		if (result && result.error) {
			return response.send({
				status: result.error.status,
				message: result.error.message,
			});
		}

		if (result && result.user) {
			return response.send({
				message: 'User retrieved',
				data: result.user,
			});
		}
	}
}
