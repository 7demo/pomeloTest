var dispatcher = require('../../../util/dispatcher');

module.exports = function (app) {
	return new Handler(app)
}

var Handler = function (app) {
	this.app = app;
}

Handler.prototype.queryEntry = function (msg, session, next) {

	console.log('======================')
	console.log(msg)
	console.log('======================')
	var uid = msg.uid;
	if (!uid) {
		next(null, {
			code : 600
		})
		return;
	}

	var connectors = this.app.getServersByType('connector');
	if (!connectors || connectors.length === 0) {
		next(null, {
			code : 700
		})
		return;
	}

	var res = dispatcher.dispatch(uid, connectors);
	next(null, {
		code : 300,
		data : res
	})

}