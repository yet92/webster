import Joi from 'joi';

export default class ProjectValidator {
	create(body: { project: string; title: string; thumbnail?: string }) {
		const schema = Joi.object({
			title: Joi.string().alphanum().min(3).max(30).required().messages({
				'*': 'Incorrect project title. Must consist of only letters and numbers. Length should be from 3 to 30 characters',
			}),
			project: Joi.string().min(2).max(30).required().messages({
				'*': 'Incorrect project title. Must consist of only letters and numbers. Length should be from 3 to 30 characters',
			}),
			thumbnail: Joi.string(),
		});
		return schema.validate(body);
	}
}
