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
    conn.query("SELECT * FROM users", function(err, result) {
        errCheck(err);
        callback(result);
    });
};

exports.new = function(user, callback) {
    conn.query("INSERT INTO users VALUES ( ?, ?, ?)", [ user.id, user.name, user.photoUrl], function(err, result) {
        if(err) {
            callback(0);
        } else {
            callback(1);
        }
    });
};

exports.getOthers = function(id, callback) {
    conn.query("SELECT *, IF(id IN (SELECT id FROM friends WHERE id1=?), 1, 0) as isFriends FROM users WHERE id <> ?", [ id, id ], function(err, result) {
        errCheck(err);
        callback(result);
    });
};

exports.addFriend = function(id, friend, callback) {
    conn.query("INSERT INTO friends VALUES ( ?, ? )", [ id, friend ], function(err, result) {
        if(err) {
            callback(0);
            return;
        }
        conn.query("INSERT INTO friends VALUES ( ?, ? )", [ friend, id ], function(err, result) {
            if(err) {
                callback(0);
                return;
            }
            callback(1);
        });
    });
};

exports.getFriends = function(id, callback) {
    conn.query("SELECT * FROM friends LEFT JOIN users ON WHERE friends.id1=? AND friedns.id2 = users.id",
        [id],
        function(err, result) {
            errCheck(err);
            callback(result);
        });
};