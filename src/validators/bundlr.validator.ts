import Joi from 'joi';
import {validate} from '../middlewares/validate';

export const uploadValidator = validate(
  Joi.object<{
    payload: string;
  }>({
    payload: [Joi.string().required(), Joi.object().required()],
  }),
  'body'
);
