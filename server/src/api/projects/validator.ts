import Joi from 'joi';

export default class ProjectValidator {
	create(body: { project: string; title: string; thumbnail?: string }) {
		const schema = Joi.object({
			title: Joi.string()
			.min(3)
			.max(30)
			.pattern(/^[0-9a-zA-Z\s]*$/)
			.trim()
			.messages({
				"*": "Incorrect project title. Must consist of only letters and numbers. Length should be from 3 to 30 characters",
			}),
			project: Joi.string().min(2).required().messages({
				'*': 'Incorrect project data.',
			}),
			thumbnail: Joi.any(),
		});
		return schema.validate(body);
	}
}
