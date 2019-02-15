const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
     
    console.log('Connected to MongoDB server');

    db.collection('Users').find({name: 'Bob'}).toArray()
        .then((docs) => {
            //console.log('---Users count---', count);
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch Users');
        });

    //db.close();

});