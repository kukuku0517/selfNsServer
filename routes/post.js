var express = require('express');
var router = express.Router();
var Post = require('../db/post.js');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function(req, file, cb) {
        var count = req.count;
        cb(null, file.fieldname + '-' + req.params.id + '.jpg');
    }
});

var upload = multer({ 'storage': storage});
var photoUpload = multer({'storage': storage}).single('photos');

router.get('/all', function(req, res, next) {
    Post.getAll(function(result) {
        res.json(result);
    })
});

router.post('/:id/tag', function(req, res, next) {
    var id = req.params.id;
    var friends = req.body;
    Post.tag(id, friends, function(result) {
        res.send({'result':result});
    });
});

router.get('/:id/tag', function(req, res, next) {
    var id = req.params.id;
    Post.getTag(id, function(result) {
        res.json(result);
    });
});

router.get('/:id/others', function(req, res, next) {
    var id = req.params.id;
    var userId = req.query.userId;
    Post.getOthers(id, userId, function(result) {
        res.json(result);
    });
});

router.get('/:id/items', function(req, res, next) {
    var group_id = req.params.id;
    Post.getItems(group_id, function(result) {
        res.json(result);
    });
});
 
router.post('/:id/item', function(req, res, next) {
    var group_id = req.params.id;
    var item = req.body;
    console.log('group_id:', group_id);
    console.log('item:', item);
    Post.getUserId(group_id, function(user_id) {
        console.log('user_id:', user_id);
        Post.newItem(user_id, item, group_id, function(result) {
            res.send({'id': result});
        });
    });
});

router.post('/:id/photoUpload', function(req, res, next) {
    var photo_id = req.params.id;
    console.log('photo_id:', photo_id);
    photoUpload(req, res, function(err) {
        if(err) {
            res.status(400);
        } else {
            var url = 'https://selfns-taejoonhong.c9users.io:8080/images/photos-' + photo_id + '.jpg';
            res.send({'url': url});
        }
    });
})

module.exports = router;
