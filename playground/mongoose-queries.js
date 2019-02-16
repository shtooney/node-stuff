const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*
const id = '5c678a42cd0be0ba080af334';

if(!ObjectID.isValid(id)){
    console.log('id not valid');
}


Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});


Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('ID not found');
    }
    console.log('Todo by Id', todo);
}).catch((e) => console.log(e));
*/

//query works no user --> user found print user --> ehandle any errors that cocured
const id = '5c673ab3e150ad3239200e9b';

User.findById(id).then((user) => {
    if(!user){
        return console.log('ID not found');
    }
    console.log('User by Id:', JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));

