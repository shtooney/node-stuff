const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Delete -> Todo.remove(), like find --> ({}) removes everything
/*
Todo.remove({}).then((result) => {
    console.log(result);
});
*/

//Delete -> Todo.remove(), like find --> ({}) removes everything
Todo.findByIdAndRemove('5c6860a216178605da2339bc').then((todo) => {
    console.log(todo);
});