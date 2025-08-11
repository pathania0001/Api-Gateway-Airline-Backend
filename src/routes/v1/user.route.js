
const {Router} = require('express');
const Controller = require('../../controllers');
const Middleware = require('../../middlewares');
const asyncHandler = require('../../utils/asyncHandler');
const userRoutes = Router();

userRoutes.post("/register",Middleware.User.validateUserInput,Controller.User.addUser);

// userRoutes.get("/",Middleware.User,Controller.User.getAllUsers)

// userRoutes.get('/:id',Middleware.User,Controller.User.getUser)

// userRoutes.patch('/:id',Middleware.User,Controller.User.updateUser)

// userRoutes.delete('/:id',Middleware.User,Controller.User.deleteUser)

module.exports = userRoutes