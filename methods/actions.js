var User = require('../models/user');
var Todo = require('../models/todo');

var functions = {

    // user methods
    getUsers: function (req, res) {
        User.find({}, function (err, users) {
            res.send(users.reduce(function (userMap, item) {
                userMap[item._id] = item;

                return userMap;
            }, {}));
        });
    },

    // todo's methods
    getTodos: function (req, res) {
        console.info('trying to get todo')
        Todo.find({}, function (err, todos) {
            res.send(todos.reduce(function (todoMap, item) {
                todoMap[item._id] = item;

                return todoMap;
            }, {}));
        });
    },

    getTodoById: function (req, res) {
        Todo.findOne({
            '_id': req.params.id
        }, function (err, todo) {
            return todo;
        });
    },

    addTodo: function (req, res) {
        var newTodo = new Todo({
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline,
            priority: req.body.priority
        });

        newTodo.save(function (err, newTodo) {
            if (err) {
                res.json({
                    success: false,
                    msg: 'Saving failed! ' + err.message
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Successfully saved.'
                });
            }
        })
    }

};

module.exports = functions;