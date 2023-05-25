import Joi from "joi";

export default class AuthValidator {

    private emailJoi = Joi.string().email().messages({
        "*": "incorrect email"
    });

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
            email: this.emailJoi.required(),

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

    login(body: { email: string, password: string }) {
        const schema = Joi.object({
            email: this.emailJoi.required(),
            password: Joi.string().required().messages({"*": "incorrect password"}),
        });

        return schema.validate(body);
    }

}