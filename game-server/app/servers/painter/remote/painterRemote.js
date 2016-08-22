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
		
	})
	cb(null, this.get(roomId));

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
PainterRemote.prototype.get = function (name) {
	var users = [];
	var channel = this.channelService.getChannel(name);
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
	
	var channel = this.channelService.getChannel(roomId);
	
	if (!!channel) {
		channel.leave(uid, sid)
		channel.pushMessage({
			route : 'onLeave',
			user : uid + sid
		})
	}

	cb&&cb(null);
	

}