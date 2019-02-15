const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

/*
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});
*/
let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});


let newUser = new User({
    email: '      test2@test.test  '
});

newUser.save().then((doc) => {
    console.log('------');
    console.log('saved todo', JSON.stringify(doc, undefined, 2));
    console.log('------');
}, (e) => {
    console.log('Unable to save todo');
});