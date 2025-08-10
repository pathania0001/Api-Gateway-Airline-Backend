
const {Router} = require('express');
const Controller = require('../../../controllers');
const Middleware = require('../../../middlewares');
const userRoutes = Router();

userRoutes.post("/register",Middleware.User.validateUserInput,Middleware.asyncHandler(Controller.User.addUser));

userRoutes.get("/",Middleware.asyncHandler(Controller.User.getAllUsers))

userRoutes.get('/:id',Middleware.asyncHandler(Controller.User.getUser))

userRoutes.patch('/:id',Middleware.asyncHandler(Controller.User.updateUser))

userRoutes.delete('/:id',Middleware.asyncHandler(Controller.User.deleteUser))
module.exports = userRoutes