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
  	session.set('roomId', msg.roomId);
  	session.on('closed', onUserLeave.bind(null, self.app))
  	session.push('uid');
  	session.push('roomId');
  	session.pushAll();
   
   	self.app.rpc.painter.painterRemote.add(session, msg.uid, self.app.get('serverId'), msg.roomId, true, function (users) {
   		console.log('-----, ++++0', users)
   		next(null, {
   			users:users
   		})
   	})

   // 	next(null, {
  	// 	code : 200,
  	// 	data : {
  	// 		msg : undefined
  	// 	}
  	// })

};

Handler.prototype.chat = function (msg, session, next) {
	var channel = this.channelService.getChannel(session.get('roomId'), true);

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
	console.log('+++++')
	console.log(session)
	console.log('+++++')
	if (!session && !session.uid) {
		console.log('断开连接')
		return;
	}
	app.rpc.painter.painterRemote.kick(session, session.uid, app.get('serverId'), session.get('roomId'))
}
