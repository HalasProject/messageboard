const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Thread = require('../models/thread');
const Reply = require('../models/thread');

chai.use(chaiHttp);
const board = "general";
let thread_id = null;
let reply_id = null;

suite('Functional Tests', function() {
    
    this.beforeAll(function (done) {
        Thread.deleteMany().exec()
        Reply.deleteMany().exec()
        console.log("[✳] Purge Collections ✅")
        done();
    })

    //Creating a new thread: POST request to /api/threads/{board}
    test("Should create a new thread", (done) => {
        chai.request(server).post(`/api/threads/${board}`).type('form').send({
            text:"Random Text",
            delete_password:"randompassword"
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.containsAllKeys(res.body, ['text', 'delete_password','board', '_id', 'created_on', 'replies', 'bumped_on', 'reported']);
            thread_id = res.body._id;
            done();
        })
    })

    //Creating a new reply: POST request to /api/replies/{board}
    test("Should create a new reply", (done) => {
        chai.request(server).post(`/api/replies/${board}`).type('form').send({
            text:"Random Text",
            delete_password:"randompassword",
            thread_id:thread_id
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.containsAllKeys(res.body, ['text', 'delete_password', '_id', 'created_on', 'reported']);
            reply_id = res.body._id
            done();
        })
    })

    //Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
    test("Should return the 10 most recent threads with 3 replies each", (done) => {
        chai.request(server).get(`/api/threads/${board}`).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
        })
    })

    //Viewing a single thread with all replies: GET request to /api/replies/{board}
    test("Should return a single thread with all replies", (done) => {
        chai.request(server).get(`/api/replies/${board}`).query({
            thread_id:thread_id
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.containsAllKeys(res.body, ['text', 'delete_password', '_id', 'created_on', 'replies', 'bumped_on', 'reported']);
            assert.isArray(res.body.replies);
            done();
        })
    })


    //Reporting a thread: PUT request to /api/threads/{board}
    test("Should report a thread", (done) => {
        chai.request(server).put(`/api/threads/${board}`).send({
            thread_id:thread_id
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
        })
    })

    //Reporting a reply: PUT request to /api/replies/{board}
    test("Should report a reply", (done) => {
        chai.request(server).put(`/api/replies/${board}`).send({
            reply_id:reply_id
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
        })
    })


    //Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
    test("Should return an error when deleting a reply with the incorrect password", (done) => {
        chai.request(server).delete(`/api/replies/${board}`).send({
            reply_id:reply_id,
            delete_password:"wrongpassword"
        }).end((err, res) => { 
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
        })
    })
    
    //Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
    test("Should return an error when deleting a thread with the incorrect password", (done) => {
        chai.request(server).delete(`/api/threads/${board}`).send({
            thread_id:thread_id,
            delete_password:"wrongpassword"
        }).end((err, res) => {
            if (err) throw err;
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
        })
    })

            


    
})
