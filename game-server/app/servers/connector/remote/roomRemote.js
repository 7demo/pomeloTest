/**
 * 维护connector房间信息
 * 现在channel的信息维护于painter
 */

var Remote = function (app) {
	this.app = app;
	this.channelService = this.app.get('channelService');
}

module.exports = function (app) {
	return new Remote(app);
}
// /**
//  * 创建channel
//  */
// Remote.prototype.open = function (channelId, cb) {
// 	var channel = this.channelService.createChannel(channelId);
// 	cb(null);
// }

// /**
//  * 获取channel用户的消息
//  */
// Remote.prototype.getMembers = function (channelId, cb) {

// 	var channel = this.channelService.getChannel(channelId);
// 	console.log('---------++++',  channel)
// 	if (channel) {
// 		var members = channel.getMembers();
// 		console.log('^^^^^^^^^^^^^^^^^^', channel.getMembers(), members)
// 		cb(null, members);
// 	} else {
// 		cb(null, 0);
// 	}
	
// }

// /**
//  * 销毁channel
//  */
// Remote.prototype.close = function (channelId, cb) {
// 	var channel = this.channelService.destoryChannel(channelId);
// 	cb(null);
// }