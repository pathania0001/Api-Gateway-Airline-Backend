const asyncHandler = require('./middleware.asyncHandler');
const globalError = require('./middleware.global.error');


module.exports = {
    globalError,
    asyncHandler,
}