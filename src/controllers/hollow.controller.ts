import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {hollowClient} from '../clients/hollow';
import {respond} from '../utilities/respond';
import type {
  IGetParam,
  IPutBody,
  IRemoveBody,
  IUpdateBody,
} from '../interfaces/hollow.interface';

export async function put(
  request: Request<{}, {}, IPutBody>,
  response: Response
) {
  const {key, value} = request.body;
  console.log('PUTTING:', typeof value);

  try {
    await hollowClient().hollowdb.put(key, value);
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (err) {
    const error = err as Error;
    if (error.message.startsWith('Contract Error')) {
      return respond.failure(response, error.message, StatusCodes.BAD_REQUEST);
    }
    return respond.error(response, 'hollowdb.put', error);
  }
}

export async function update(
  request: Request<{}, {}, IUpdateBody>,
  response: Response
) {
  const {key, value, proof} = request.body;
  try {
    await hollowClient().hollowdb.update(key, value, proof);
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (err) {
    const error = err as Error;
    if (error.message.startsWith('Contract Error')) {
      return respond.failure(response, error.message, StatusCodes.BAD_REQUEST);
    }
    return respond.error(response, 'hollowdb.update', error);
  }
}

export async function remove(
  request: Request<{}, {}, IRemoveBody>,
  response: Response
) {
  const {key, proof} = request.body;
  try {
    await hollowClient().hollowdb.remove(key, proof);
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (err) {
    const error = err as Error;
    if (error.message.startsWith('Contract Error')) {
      return respond.failure(response, error.message, StatusCodes.BAD_REQUEST);
    }
    return respond.error(response, 'hollowdb.remove', error);
  }
}

// TODO check if the response from hollow is empty, then return 404
export async function get(request: Request, response: Response) {
  const {key} = request.params as unknown as IGetParam; // TODO: would like to have a better version
  try {
    const value = await hollowClient().hollowdb.get(key);
    return respond.success(response, 'success', {value}, StatusCodes.OK);
  } catch (error) {
    return respond.error(
      response,
      'hollowdb.get',
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
