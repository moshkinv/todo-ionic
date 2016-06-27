var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/database');


var functions = {
    authenticate: function (req, res, next) {

        console.info('Auth try: ' + req.body.username + ' / ' + req.body.password);

        User.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Authenticaton failed, user not found.'
                });
            } else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right
                        // create a token
                        var token = jwt.sign(user, config.secret, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });

                        // return the information including token as JSON
                        res.status(200).json({
                            success: true,
                            user: user,
                            token: token
                        });
                    } else if (err) {
                        return res.status(403).send({
                            success: false,
                            msg: 'Authenticaton failed, error:' + err.message
                        });
                    } else {
                        return res.status(403).send({
                            success: false,
                            msg: 'Authenticaton failed, wrong password.'
                        });
                    }
                });
            }
        });
    },

    isAuthenticated: function (req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    //res.json(decoded);

                    return next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    },

    register: function (req, res) {
        if ((!req.body.username) || (!req.body.password)) { // role is 'user' by default
            res.json({
                success: false,
                msg: 'Enter all fields!'
            });
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role
            });

            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Saving failed!'
                    });
                } else {
                    res.json({
                        success: true,
                        msg: 'Successfully saved.'
                    });
                }
            })
        }
    },

    getUsers: function (req, res) {
        User.find({}, function (err, users) {
            res.send(users.reduce(function (userMap, item) {
                userMap[item._id] = item;
                return userMap;
            }, {}));
        });
    }

};

module.exports = functions;