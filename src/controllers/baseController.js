import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class BaseController {

    sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
    return sendSuccess(res, data, message, statusCode);
  }

  sendPaginated(res, data, pagination, message = 'Success') {
    return sendPaginated(res, data, pagination, message);
  }

  catchAsync(fn) {
    return asyncHandler(fn.bind(this));
  }
}

export default BaseController;
