const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
     
    console.log('Connected to MongoDB server');

    //DeleteMany
    /*
    db.collection('Users').deleteMany({name: 'Bob'})
        .then((result) => {
            console.log(result);
        });
    */

    //DeleteOne
    /*
    db.collection('Todos').deleteOne({text: 'Eat Lunch'})
        .then((result) => {
            console.log(result);
        });
    */

    //findOneAndDelete
    /*
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c67095c7161d3a734b8f8a7')})
    .then((result) => {
        console.log(result);
    });
    */

    //db.close();

});