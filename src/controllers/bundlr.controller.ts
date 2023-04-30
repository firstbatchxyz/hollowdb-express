import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {bundlrClient} from '../clients/bundlr';
import {respond} from '../utilities/respond';

export async function upload(request: Request, response: Response) {
  const payload = request.body;

  const tags = [{name: 'Content-Type', value: 'application/json'}];
  const transaction = bundlrClient().bundlr.createTransaction(
    JSON.stringify({
      data: payload,
    }),
    {
      tags: tags,
    }
  );

  await transaction.sign();
  const txID = transaction.id;
  await transaction.upload();

  return respond.success(response, '', {result: txID}, StatusCodes.CREATED);
}
