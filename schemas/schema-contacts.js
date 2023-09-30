
import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const addContactSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'any.required': 'missing required name field',
      }),
  
    phone: Joi.string()
      .required()
      .messages({
        'any.required': 'missing required phone field',
        'string.pattern.base': 'phone field must have the format (123) 456-7890',
      }),
  
    email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({
      'any.required': 'missing required email field',
    }),
    
    favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean(),
});

const notEmptySchema = Joi.object({})
  .unknown(true)
  .min(1)
  .message({'object.min':'missing fields'})

const notEmptyFavorite = Joi.object({})
  .unknown(true)
  .min(1)
  .message({'object.min':'missing field favorite'})


export default {
	addContactSchema,
	contactUpdateFavoriteSchema,
	notEmptySchema,
  notEmptyFavorite,	
};


