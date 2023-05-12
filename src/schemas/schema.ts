import Joi from 'joi';

interface put {
  key: string;
  value: string | object;
}

interface update {
  key: string;
  value: string | object;
  proof: object | undefined;
}

interface remove {
  key: string;
  proof: object | undefined;
}

interface get {
  key: string;
}

export const schemas = {
  put: Joi.object<put>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
  }),
  update: Joi.object<update>({
    key: Joi.string().required(),
    value: [Joi.string().required(), Joi.object().required()],
    proof: Joi.object(),
  }),
  remove: Joi.object<remove>({
    key: Joi.string().required(),
    proof: Joi.object(),
  }),
  get: Joi.object<get>({
    key: Joi.string().required(),
  }),
  //   upload: Joi.object({
  //     value: [Joi.string().required(), Joi.object().required()],
  //   }),
};
