module.exports = function (app) {
	return new PainterRemote(app);
}

var PainterRemote = function (app) {
	this.app = app;
	this.channelService = app.get('channelService');
}

/**
 * create user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
PainterRemote.prototype.create = function (channelId, cb) {
	var channel = this.channelService.getChannel(channelId, true);
	cb(null, this.get(channelId));
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
PainterRemote.prototype.add = function (uid, sid, channelId, cb) {

	var channel = this.channelService.getChannel(channelId);
	if (!!channel) {
		channel.add(uid, sid)
		channel.pushMessage({
			route : 'onAdd',
			data : {
				msg : '3223233'
			}
		}, function (err, data) {
			
		})
		cb(null, this.get(channelId));
	} else {
		cb('房间为创建')
	}

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
PainterRemote.prototype.get = function (name, cb) {

	var users = [];
	var channel = this.channelService.getChannel(name);
	if (!! channel) {
		users = channel.getMembers();
		if (cb) {
			cb(null, users)
		} else {
			return users
		}
	} else {
		if (cb) {
			cb('房间不存在');
		} else {
			return [];
		}
	}

}

/**
 * close channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
PainterRemote.prototype.close = function (channelId, cb) {

	var channel = this.channelService.getChannel(channelId);
	channel.destory();
	cb(null)

}

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for rroomid
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
PainterRemote.prototype.kick = function (uid, sid, channelId, cb) {
	
	var channel = this.channelService.getChannel(channelId);
	
	if (!!channel) {
		channel.leave(uid, sid)
		channel.pushMessage({
			route : 'onLeave',
			user : uid + sid
		})
	}

	cb&&cb(null);
	

}