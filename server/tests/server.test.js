const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        let text = 'todo info test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });

    });

    describe('GET /todos', () => {
        it('should all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should get todo info for given ID', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should get 404 if obj not found', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}1`) // note this is supposed to be incorrect hence "1" at the end
                .expect(404)
                .end(done);
        });

        it('should get 404 if invalid obj id', (done) => {
            request(app)
                .get(`/todos/123`)
                .expect(404)
                .end(done);
        });

    });

    describe('DELETE /todos/:id', () => {

        it('should delete todo for given ID', (done) => {
            request(app)
                .delete(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }

                    Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    }).catch((e) => done);

                });
        });

        
        it('should get 404 if obj not found', (done) => {
            request(app)
                .delete(`/todos/${todos[0]._id.toHexString()}1`) // note this is supposed to be incorrect hence "1" at the end
                .expect(404)
                .end(done);
        });
        
        it('should get 404 if invalid obj id', (done) => {
            request(app)
                .delete(`/todos/123`)
                .expect(404)
                .end(done);
        });
       

    });

    describe('PATCH /todos/:id', () => {

        it('should update todo for given ID with given body', (done) => {
            request(app)
                .patch(`/todos/${todos[0]._id.toHexString()}`)
                .send({
                    text: 'eee123',
                    completed: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe('eee123');
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done);
        });


        it('should clear completedAt when todo is not completed', (done) => {
            request(app)
                .patch(`/todos/${todos[1]._id.toHexString()}`)
                .send({
                    text: 'eee123',
                    completed: false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe('eee123');
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        });           

    });

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);                
        });
    });

    describe('POST /users', () => {

        let email = 'example@example.com';
        let password = '123mnb!';

        it('should create a user', (done) => {
            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end((err) => {
                    if(err) {
                        return done(err);
                    }

                    User.findOne({email}).then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe('password');
                        done();
                    });

                });  
        });
        
        it('should should return validation errors if invalid', (done) => {
            
            let wrongEmail = 'e';
            let wrongPassword = 'e';

            request(app)
            .post('/users')
            .send({
                email : wrongEmail, 
                password: wrongPassword
            })
            .expect(400)
            .end((err) => {
                if(err) {
                    return done(err);
                }
                done();
            });
        });

        it('should should not create user if email is in use', (done) => {

            request(app)
            .post('/users')
            .send({
                email : users[0].email, 
                password
            })
            .expect(400)
            .end((err) => {
                if(err) {
                    return done(err);
                }
                done();
            });

        });


    });

});
