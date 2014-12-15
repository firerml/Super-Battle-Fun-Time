var _ = require('underscore');
var model = require('../models/badges');

exports.save = function(req, res, next) {
	var badges = _.clone(req.body);
	model.save(badges, function(err) {
		if (err) return res.json(503, { error: true });
		next();
	});
};

exports.send = function() {

};