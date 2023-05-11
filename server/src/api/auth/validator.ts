import Joi from "joi";

export default class AuthValidator {

    signup(body: { email: string, username: string, password: string, repeatPassword: string }) {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required()
                // .message('incorrect username. must consist of only letters and numbers. length should be from 3 to 30 characters'),
                .messages({
                    '*': 'incorrect username. must consist of only letters and numbers. length should be from 3 to 30 characters'
                }),
            email: Joi.string()
                .email()
                .required()
                // .message('incorrect email'),
                .messages({
                    "*": "incorrect email."
                }),

            password: Joi.string()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')).required()
                // .message('incorrect password. must contain at least eight characters and at least one number and both lower and uppercase letters'),
                .messages({
                    "*": "incorrect password. must contain at least eight characters and at least one number and both lower and uppercase letters"
                }),

            repeatPassword: Joi.any()
                .valid(Joi.ref('password'))
                .required()
                // .message('incorrect repeatPassword.')
                .messages({
                    "*": "incorrect repeatPassword."
                })

        }).with('password', 'repeatPassword');
        return schema.validate(body);
    }

}