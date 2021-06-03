var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const userService = require('../services/userService');
const { authJwt } = require("../middlewares");

// A couple of test routes
// router.get('/test/users/:id', async (req, res, next) => {
//   const doc = await userService.getById(req.params.id);
//   return res.json(doc)
// });
// router.get('/test/users', async (req, res, next) => {
//   const docs = await userService.getAll();
//   return res.json({ users: docs })
// });

router.post('/signup', userController.validate('signup'), userController.signUp);
router.post('/login', userController.validate('login'), userController.login);

// Protected route
router.get('/user', authJwt.verifyToken, userController.getUser);

module.exports = router;
