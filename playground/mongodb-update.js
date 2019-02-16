const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
     
    console.log('Connected to MongoDB server');

    /*
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5c670864296e9da123e6e48b')
    },{
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('-----------');
        console.log(result);
        console.log('-----------');
    });
    */

    // change name and increment by one
    db.collection('Users').findOneAndUpdate({
        name: 'Mike'
    },{
        $set: {
            name: 'Bob'
        },
        $inc: {
            age: 5
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log('-----------');
        console.log(result);
        console.log('-----------');
    });

});

    /*
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
    */