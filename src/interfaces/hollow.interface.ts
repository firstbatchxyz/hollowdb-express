export interface IPutBody {
  key: string;
  value: string | object;
}

export interface IUpdateBody {
  key: string;
  value: string | object;
  proof: object | undefined;
}

export interface IRemoveBody {
  key: string;
  proof: object | undefined;
}

export interface IGetParam {
  key: string;
}
