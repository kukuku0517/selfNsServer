var mysql = require('mysql');
var conn = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'SelfNS'
});

function errCheck(err) {
    if(err) {
        throw err;
    }
}

exports.getAll = function(callback) {
    conn.query("SELECT * FROM posts", function(err, result) {
        errCheck(err);
        callback(result);
    });
};

exports.getByUserId = function(id, time, callback) {
    conn.query("SELECT * FROM users_posts LEFT JOIN posts ON users_posts.post_id = posts._id WHERE users_posts.user_id = ? AND timestamp >= ?", [ id, time ], function(err, result) {
        errCheck(err);
        callback(result);
    });
};

exports.new = function(user_id, post, callback) {
    conn.query("INSERT INTO posts VALUES ( NULL," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?)",
        [
            post.id,
            post.highlight,
            post.share,
            post.friends,
            post.type,
            
            post.timestamp,
            post.comment,
            post.date,
            post.person,
            post.title,
            
            post.tag,
            post.lat,
            post.lng,
            post.place,
            post._groupId,
            
            post.path,
            post.originId,
            post.address,
            post.start,
            post.end,
            
            post.endId,
            post.startId,
            post.content,
            post.count,
            post._change,
            
            post.moveState
        ], function(err, result) {
           errCheck(err); 
           conn.query("SELECT LAST_INSERT_ID() as id", function(err, result) {
               var post_id = result[0].id;
               conn.query("INSERT INTO users_posts VALUES (?, LAST_INSERT_ID(), 1)", [user_id], function(err, result) {
                   errCheck(err);
                   callback(post_id);
               });
           });
        });
};
exports.newItem = function(user_id, post, group_id, callback) {
    conn.query("INSERT INTO posts VALUES ( NULL," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?, ?, ?, ?, ?," +
        "?)",
        [
            post.id,
            post.highlight,
            post.share,
            post.friends,
            post.type,
            
            post.timestamp,
            post.comment,
            post.date,
            post.person,
            post.title,
            
            post.tag,
            post.lat,
            post.lng,
            post.place,
            group_id,
            
            post.path,
            post.originId,
            post.address,
            post.start,
            post.end,
            
            post.endId,
            post.startId,
            post.content,
            post.count,
            post._change,
            
            post.moveState
        ], function(err, result) {
           errCheck(err); 
           conn.query("SELECT LAST_INSERT_ID() as id", function(err, result) {
               var post_id = result[0].id;
               conn.query("INSERT INTO users_posts VALUES (?, LAST_INSERT_ID(), 1)", [user_id], function(err, result) {
                   errCheck(err);
                   callback(post_id);
               });
           });
        });
};

exports.tag = function(post_id, friends, callback) {
    conn.query("INSERT INTO users_posts VALUES( ?, ?, 0)", [ friends.id, post_id ], function(err, result) {
        if(err) {
            callback(0);
        } else {
            callback(1);
        }
    });
};

exports.getTag = function(post_id, callback) {
    conn.query("SELECT id, name, photoUrl FROM users_posts LEFT JOIN users ON users_posts.user_id = users.id WHERE users_posts.post_id = ? ",
        [ post_id ],
        function(err, result) {
           errCheck(err);
           callback(result); 
        });
};

exports.getOthers = function(id, userId, callback) {
    conn.query("SELECT id, name, photoUrl FROM friends LEFT JOIN users ON friends.id2 = users.id WHERE friends.id1 = ? AND friends.id2 NOT IN (SELECT user_id as id2 FROM users_posts WHERE post_id=?)",
        [userId, id],
        function(err, result) {
            errCheck(err);
            callback(result);
        });
};

exports.getUserId = function(post_id, callback) {
    conn.query("SELECT id FROM users_posts LEFT JOIN users ON users_posts.user_id = users.id WHERE users_posts.post_id = ?",
        [post_id],
        function(err, result) {
            errCheck(err);
            callback(result[0].id);
        });
};

exports.getItems = function(group_id, callback) {
    conn.query("SELECT * FROM posts WHERE _groupId = ?", [group_id], function(err, result) {
        errCheck(err);
        callback(result);
    })
}