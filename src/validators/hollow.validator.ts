import Joi from 'joi';
import {validate} from '../middlewares/validate';

export const putValidator = validate(
  Joi.object<{
    key: string;
    value: string | object;
  }>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
  }),
  'body'
);

export const updateValidator = validate(
  Joi.object<{
    key: string;
    value: string | object;
    proof: object | undefined;
  }>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
    proof: Joi.object(),
  }),
  'body'
);

export const removeValidator = validate(
  Joi.object<{
    key: string;
    proof: object | undefined;
  }>({
    key: Joi.string().required(),
    proof: Joi.object(),
  }),
  'body'
);

export const getValidator = validate(
  Joi.object<{
    key: string;
  }>({
    key: Joi.string().required(),
  }),
  'params'
);
