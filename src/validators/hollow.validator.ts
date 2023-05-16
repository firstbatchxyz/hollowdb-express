import Joi from 'joi';
import {validate} from '../middlewares/validate';
import type {
  IGetParam,
  IPutBody,
  IRemoveBody,
  IUpdateBody,
} from '../interfaces/hollow.interface';

export const putValidator = validate(
  Joi.object<IPutBody>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
  }),
  'body'
);

export const updateValidator = validate(
  Joi.object<IUpdateBody>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
    proof: Joi.object(),
  }),
  'body'
);

export const removeValidator = validate(
  Joi.object<IRemoveBody>({
    key: Joi.string().required(),
    proof: Joi.object(),
  }),
  'body'
);

export const getValidator = validate(
  Joi.object<IGetParam>({
    key: Joi.string().required(),
  }),
  'params'
);
