import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {hollowClient} from '../clients/hollow';
import {respond} from '../utilities/respond';

export async function put(request: Request, response: Response) {
  try {
    await hollowClient().hollowdb.put(request.body.key, request.body.value);
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (error) {
    return respond.error(response, 'hollowdb.put', error);
  }
}

export async function update(request: Request, response: Response) {
  try {
    await hollowClient().hollowdb.update(
      request.body.key,
      request.body.value,
      request.body.proof
    );
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (error) {
    return respond.error(response, 'hollowdb.update', error);
  }
}

export async function remove(request: Request, response: Response) {
  try {
    await hollowClient().hollowdb.remove(request.body.key, request.body.proof);
    return respond.success(response, 'success', {}, StatusCodes.OK);
  } catch (error) {
    return respond.error(response, 'hollowdb.remove', error);
  }
}

//@TODO check if the response from hollow is empty, then return 404
export async function get(request: Request, response: Response) {
  try {
    const result = await hollowClient().hollowdb.get(request.params.key);
    return respond.success(
      response,
      'success',
      {result: result},
      StatusCodes.OK
    );
  } catch (error) {
    return respond.error(
      response,
      'hollowdb.get',
      error,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
