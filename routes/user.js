var express = require('express');
var router = express.Router();
var User = require('../db/user.js');
var Post = require('../db/post.js');

router.get('/all', function(req, res, next) {
    User.getAll(function(result) {
        res.json(result);
    })
});

router.post('/:id/post', function(req, res, next) {
    var id = req.params.id;
    var post = req.body;
    console.log('id:', id);
    console.log('post:', post);
    Post.new(id, post, function(post_id) {
        res.send({'id':post_id});
    });
});

router.get('/:id/post', function(req, res, next) {
    var id = req.params.id;
    var date = req.query.date;
    Post.getByUserId(id, date, function(result) {
       res.json(result); 
    });
});

router.post('/new', function(req, res, next) {
    var user = req.body;
    User.new(user, function(result) {
        res.send({'result':result});
    });
});

router.get('/:id/others', function(req, res, next) {
    var id = req.params.id;
    User.getOthers(id, function(result) {
        res.send(result);
    });
});

router.post('/:id/friend', function(req, res, next) {
    var id = req.params.id;
    var friend = req.body.id;
    console.log('friend:', friend);
    User.addFriend(id, friend, function(result) {
        res.send({'result':result});
    });
});

router.get('/:id/friends', function(req, res, next) {
    var id = req.params.id;
    User.getFriends(id, function(result) {
        res.json(result);
    });
});

module.exports = router;
