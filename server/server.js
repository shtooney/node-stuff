require('./config/config');

const _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', authenticate, (req, res) => {

    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', authenticate, (req, res) => {
    
    let id = req.params.id;

    
    //validate ID = stop and give back 404 and send back empty body
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    } else {
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if(!todo){
                res.status(404).send();
            } else {
                //console.log('User by Id:', JSON.stringify(user, undefined, 2));
                res.send({todo});
            }            
        }).catch((e) => res.status(400).send());
        
    }    
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    try{
        let id = req.params.id;
        if(!ObjectID.isValid(id)){
            res.status(404).send();
        } else {
            const todo = await Todo.findOneAndRemove({
                _id: id,
                _creator: req.user._id
            });
            if(!todo){
                res.status(404).send();
            } else {                
                res.status(200).send({todo});
            } 
        }
    } catch (e) {
        res.status(400).send();
    }
});


app.patch('/todos/:id', authenticate, (req, res) => {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
        
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            res.status(404).send();
        }

        res.status(200).send({todo});         

    }).catch((e) => res.status(400).send());
        

});

//post user entry
app.post('/users', async (req, res) => {
    
    try{
        let body = _.pick(req.body, ['email', 'password']);
        
        console.log(req.body);
        let user = new User(body);

        const dbSave = await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user); 
    } catch (e) {
        res.status(400).send(e);
    }

});


//get email and password --> verify --> res BodyData (email & password)
app.post('/users/login', async (req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, async (req, res) => {
   try {
    await req.user.removeToken(req.token);
    res.status(200).send();
   } catch (e) {
    res.status(400).send();
   }

});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app};