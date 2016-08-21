var dispatcher = require('../../../util/dispatcher');

module.exports = function (app) {
	return new Handler(app)
}

var Handler = function (app) {
	this.app = app;
}

Handler.prototype.queryEntry = function (msg, session, next) {
	var uid = msg.roomId;
	if (!uid) {
		next(null, {
			code : 500
		})
		return;
	}

	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
			code : 500
		})
		return;
	}

	var res = dispatcher.dispatch(uid, connectors);
	next(null, {
		code : 200,
		data : res,
		uid : uid
	})

}