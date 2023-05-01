import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';
import {respond} from '../utilities/respond';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utilities/logger';

export function validate(
  schema: Joi.ObjectSchema,
  property: 'body' | 'query' | 'params' = 'body'
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const result: Joi.ValidationResult = schema.validate(request[property]);
    if (result.error) {
      logger.log(result.error);
      respond.failure(
        response,
        'Data validation failed:\n' + result.error,
        StatusCodes.BAD_REQUEST
      );
    } else next();
  };
}
