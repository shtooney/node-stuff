const _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos/:id', (req, res) => {
    
    let id = req.params.id;

    
    //validate ID = stop and give back 404 and send back empty body
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if(!todo){
                res.status(404).send();
            } else {
                //console.log('User by Id:', JSON.stringify(user, undefined, 2));
                res.send({todo});
            }            
        }).catch((e) => res.status(400).send());
        
    }    
});

app.delete('/todos/:id', (req, res) => {
    
    let id = req.params.id;

    
    //validate ID = stop and give back 404 and send back empty body
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    } else {
        //if null, account for it
        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo){
                res.status(404).send();
            } else {                
                res.status(200).send({todo});
            }            
        }).catch((e) => res.status(400).send());
        
    }    
});

app.patch('/todos/:id', (req, res) => {
    
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            res.status(404).send();
        }

        res.status(200).send({todo});         

    }).catch((e) => res.status(400).send());
        

});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app};