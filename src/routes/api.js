const express = require('express');
const userController = require('../controllers/userController');
const { authAdmin } = require('../middleware/auth');
const postController = require('../controllers/postController')
const { apiLimiter } = require('../middleware/rateLimiter');

const routerAPI = express.Router();

routerAPI.use(apiLimiter);

routerAPI.get("/", (req, res) => { return res.status(200).json("Hello world api") })
routerAPI.get("/account", authAdmin, userController.account)

routerAPI.post("/register", userController.register)
routerAPI.post("/login", userController.login)
routerAPI.post("/refresh_token", userController.refresh_token)
routerAPI.post('/logout', userController.logout)

routerAPI.post('/posts', postController.createPost)
routerAPI.put('/posts/:id', postController.updatePost)
routerAPI.delete('/posts/:id', postController.deletePost)
routerAPI.get('/posts/:id', postController.getPostById)
routerAPI.get('/posts', postController.getAllPost)


module.exports = routerAPI;