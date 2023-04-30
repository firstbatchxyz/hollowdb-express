import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {hollowClient} from '../clients/hollow';
import {respond} from '../utilities/respond';

//@TODO: implement hollow controller
export async function put(request: Request, response: Response) {
  let key: string = 'key';
  let value: string = 'value'; //needs to be converted to any in hollowdb

  await hollowClient().hollowdb.put(key, value);

  return respond.success(response, '', {}, StatusCodes.CREATED);
}

export async function get(request: Request, response: Response) {}

export async function update(request: Request, response: Response) {}

export async function remove(request: Request, response: Response) {}
