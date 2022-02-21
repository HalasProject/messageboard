'use strict';
const threads = require('../controllers/threads');
const replies = require('../controllers/replies');

module.exports = function (app) {

  app.route('/api/threads/:board')
    .get(threads.list)
    .post(threads.create)
    .delete(threads.destroy)
    .put(threads.report);

  app.route('/api/replies/:board')
    .get(replies.list)
    .post(replies.create)
    .delete(replies.destroy)
    .put(replies.report);

};
