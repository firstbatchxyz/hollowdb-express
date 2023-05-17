import {} from 'express';

export interface IPutBody {
  key: string;
  value: unknown;
}

export interface IUpdateBody {
  key: string;
  value: unknown;
  proof: object | undefined;
}

export interface IRemoveBody {
  key: string;
  proof: object | undefined;
}

export interface IGetParam {
  key: string;
}
