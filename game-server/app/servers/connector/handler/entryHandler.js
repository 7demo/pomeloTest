module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  this.channelService = app.get('channelService');
};

Handler.prototype.entry = function(msg, session, next) {
  	// next(null, {code: 200, msg: 'game server is ok.'});
  	
  	if (!msg.uid) {
  		next(null, {code: 500, msg: 'uid is empty.'});
  		return;
  	}
  	var self = this;

  	session.bind(msg.uid)
  	session.set('uid', msg.uid);
  	session.set('channelId', msg.channelId);
  	session.on('closed', onUserLeave.bind(null, self.app))
  	session.push('uid');
  	session.push('channelId');
   
   	self.app.rpc.painter.painterRemote.add(session, msg.uid, self.app.get('serverId'), msg.channelId, function (err, users) {
   		next(null, {
   			users:users,
   			uid : msg.uid
   		})
   	})

};

Handler.prototype.chat = function (msg, session, next) {
	var channel = this.channelService.getChannel(session.get('channelId'), true);

	if (msg.target) {
		var sid = this.app.get('serverId');
		channel.pushMessageByUids('onSends', {
			msg : '这是消息'
		}, [{
			uid : msg.target,
			sid : sid
		}])
	} else {
		channel.pushMessage({
			route : 'onChat1',
			data : {
				msg : '这是消息' + msg.msg
			}
		})
	}
	next(null, {
		route : msg
	})

}

var onUserLeave = function (app, session, reason) {

	if (!session && !session.uid) {
		console.log('断开连接')
		return;
	}
	var uid = session.get('uid');
	var sid = app.get('serverId');
	var channelId = session.get('channelId');
	app.rpc.painter.painterRemote.kick(session, uid, sid, channelId, null) //null为必须

}
