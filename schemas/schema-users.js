import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userRegisterSchema = Joi.object({
    email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({
        'any.required': 'missing required email field',
    }),
    password: Joi.string()
    .min(7)
    .required()
    .messages({
        'any.required': 'missing required password field',
    }),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(7).required(),
});

export default {
    userRegisterSchema,
    userLoginSchema
}