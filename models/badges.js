var redis = require('../lib/redis');


// Save badges to database
exports.save = function(badges, callback) {
	var badge = badges.pop();
	redis.lpush('badges', JSON.stringify(badge), function(err) {
		if (err) return callback(err, null);
		exports.save(badges, callback);
	});
};