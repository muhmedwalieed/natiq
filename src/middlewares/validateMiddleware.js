import ApiError from '../utils/apiError.js';

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ['body', 'query', 'params'].forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          error.details.forEach((detail) => {
            errors.push({
              field: detail.path.join('.'),
              message: detail.message,
            });
          });
        } else if (key === 'body') {
          req.body = value;
        } else {

          Object.keys(req[key]).forEach((k) => {
            if (!(k in value)) delete req[key][k];
          });
          Object.assign(req[key], value);
        }
      }
    });

    if (errors.length > 0) {
      throw ApiError.badRequest('Validation failed', errors);
    }

    next();
  };
};

export default validate;
