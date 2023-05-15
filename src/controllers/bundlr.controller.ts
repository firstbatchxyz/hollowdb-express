import type {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
// import {bundlrClient} from '../clients/bundlr';
import {respond} from '../utilities/respond';
import type {IUploadBody} from '../interfaces/bundlr.interface';

export async function upload(
  request: Request<{}, {}, IUploadBody>,
  response: Response
) {
  return respond.failure(
    response,
    'Not implemented.',
    StatusCodes.NOT_IMPLEMENTED
  );

  // const {payload} = request.body;

  // const transaction = bundlrClient().bundlr.createTransaction(
  //   JSON.stringify({
  //     data: payload,
  //   }),
  //   {
  //     tags: [{name: 'Content-Type', value: 'application/json'}],
  //   }
  // );

  // await transaction.sign();
  // const txID = transaction.id;
  // await transaction.upload();

  // return respond.success(response, '', {result: txID}, StatusCodes.CREATED);
}
