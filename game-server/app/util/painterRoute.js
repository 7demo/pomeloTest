/**
 * 路由分配
 * @param  {[type]}   session [description]
 * @param  {[type]}   msg     [description]
 * @param  {[type]}   app     [description]
 * @param  {[type]}   type    [description]
 * @param  {Function} cb      [description]
 * @return {[type]}           [description]
 */
var dispatcher = require('./dispatcher.js');

module.exports = function (session, msg, app, cb) {
	
	var servers = app.getServersByType('painter');
	if (!servers || servers.length === 0) {
		cb(new Error('can not find servers'))
		return;
	}

	if (typeof session == 'object') { //session
		var res = dispatcher.dispatch(session.get('channelId'), servers)
	} else {
		var channelId = session;
		var res = dispatcher.dispatch(channelId, servers)
	}
	// var res = dispatcher.dispatch(session.get('channelId'), servers)

	

	cb(null, res.id)

}