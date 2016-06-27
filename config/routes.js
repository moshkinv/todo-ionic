var express = require('express');
var actions = require('../methods/actions');
var auth = require('../methods/auth');
var path = require('path');
var router = express.Router();

router.post('/api/authenticate', auth.authenticate);
router.post('/api/register', auth.register);

router.all('/api/*', auth.isAuthenticated);

router.get('/api/users', actions.getUsers);

router.get('/api/todos', actions.getTodos);
router.get('/api/todos/:id', actions.getTodoById);

router.post('/api/addtodo', actions.addTodo);

router.get('/', function (req, res) {
    res.sendFile(path.resolve('.') + '/www/index.html');
    //__dirname : It will resolve to your project folder.
});

module.exports = router;