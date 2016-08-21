module.exports = function (app) {
	return new PainterRemote(app);
}

var PainterRemote = function (app) {
	this.app = app;
	this.channelService = app.get('channelService');
}

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
PainterRemote.prototype.add = function (uid, sid, roomId, flag, cb) {
	console.log('++++++------+++===========', uid, sid, roomId, flag)
	var channel = this.channelService.getChannel(roomId, flag);
	if (!!channel) {
		channel.add(uid, sid)
	}
	channel.pushMessage({
		route : 'onAdd',
		data : {
			msg : '3223233'
		}
	}, function (err, data) {
		console.log('IIIIIIIIIIIIIIII', data)
	})
	cb(null, this.get(roomId, flag));

}

/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
PainterRemote.prototype.get = function (name, flag) {
	var users = [];
	var channel = this.channelService.getChannel(name, flag);

	if (!! channel) {
		users = channel.getMembers();
	}

	return users;

}

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for rroomid
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
PainterRemote.prototype.kick = function (uid, sid, roomId, cb) {
	console.log('_______')
	console.log(uid, sid, roomId)
	console.log('_______')
	var channel = this.channelService.getChannel(roomId);
	channel.pushMessage({
		route : 'onLeave',
		user : uid + sid
	})
	
	if (!!channel) {
		channel.leave(uid, sid)
	}

	cb&&cb(null);
	

}