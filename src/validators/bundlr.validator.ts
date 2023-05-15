import Joi from 'joi';
import {validate} from '../middlewares/validate';
import type {IUploadBody} from '../interfaces/bundlr.interface';

export const uploadValidator = validate(
  Joi.object<IUploadBody>({
    payload: [Joi.string().required(), Joi.object().required()],
  }),
  'body'
);
