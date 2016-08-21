module.exports = function (app) {
	return new PainterHandler(app);
}

var PainterHandler = function (app) {
	this.app = app;
	this.channelService = app.get('channelService');
}


/**
 * 发送消息
 */
PainterHandler.prototype.send = function (msg, session, next) {
	console.log('++++', this.app.get('serverId'))
	var channel = this.channelService.getChannel(session.get('roomId'));

	if (!channel) return;
	
	if (msg.target) {
		var sid = this.app.get('serverId');
		channel.pushMessageByUids('onSends', {
			msg : '这是消息'
		}, [{
			uid : msg.target,
			sid : sid
		}])
	} else {
		// console.log('======', channel)
		// channel.pushMessage('onChat', {
		// 	msg : '这是消息' + msg.msg
		// })
		channel.pushMessage({
			route : 'onChat',
			data : {
				msg : '这是消息' + msg.msg
			}
		})
	}
	next(null, {
		route : msg
	})

} 