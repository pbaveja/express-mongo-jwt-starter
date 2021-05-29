const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appConfig = require('../config/app.config.js');

const { body, validationResult } = require('express-validator');
const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  }
});

exports.signUp = async (req, res, next) => {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array()[0]);
        return;
    }
    const token = jwt.sign({ email: req.body.email }, appConfig.JWT_SIGNING_KEY, { expiresIn: appConfig.JWT_EXPIRY });

    let newUser = { email: req.body.email }
    try {
        newUser = await userService.create(newUser);
        return res.json(newUser);
    } catch(err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array()[0]);
        return;
    }
  
    try {
        let user = await userService.getPasswordByEmail(req.body.email);
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let userToUpdate = await userService.getByEmail(req.body.email);
                // Generate new token and store with user
                const token = jwt.sign({ email: req.body.email }, appConfig.JWT_SIGNING_KEY, { expiresIn: appConfig.JWT_EXPIRY });
                await userService.updateToken(userToUpdate.id, req.body.product, token);
                return res.json(await userService.getById(userToUpdate.id));
            } else {
                const err = { code: 401, message: 'Incorrect login details' };
                next(err);
            }
        } else {
            const err = { code: 404, message: 'Email is not registered' };
            next(err);
        }
    } catch(err) {
        next(err)
    }
}


exports.validate = (method) => {
  switch (method) {
    case 'signup':
      return [ 
        body('email', 'Email is invalid').exists().isEmail(),
        body('password', "Password does not exist").exists()
      ]
      break;
    case 'login':
      return [
        body('email', 'Email is invalid').exists().isEmail(),
        body('password', "Password does not exist").exists()
      ]
      break;
  }
}