var roomIdToChannelId = require('../util/roomIdToChannelId');
var dispatcher = require('../util/dispatcher.js');
var async = require('async');

var RoomServices = function (app) {
	this.app = app;
	this.rooms = {
		length : 0
	};
}

module.exports = RoomServices;


/**
 * 创建房间
 */
RoomServices.prototype.open = function (roomId, connector, auth, cb) {

	var channelId = roomIdToChannelId(roomId);
	var self = this;
	var servers = app.getServersByType('painter');
	var painter = dispatcher.dispatch(channelId, servers);

	self.rooms[roomId] = {
		channelId : channelId,
		connector : connector,
		painter : painter
	}
	self.rooms.length = ++ self.rooms.length ;
	this.app.rpcInvoke(painter.id, {
		namespace : 'user',
		service : 'painterRemote',
		method : 'create',
		args : [channelId]
	}, function (err, users) {
		if (auth == 'admin') {
			cb(err, self.rooms[roomId]) //users应该为空数组
		} else {
			cb(err, {
				channelId : channelId,
				connector : {
					host : connector.host,
					clientPort : connector.clientPort
				}
			}) //users应该为空数组
		}
		
	})

}

/**
 * 获得房间列表
 */
RoomServices.prototype.list = function (auth, cb) {

	var _list = this.rooms;
	if (auth == 'admin') {
		cb(null, _list)
	} else {

		var newList = {};
		for (var i in _list) {
			if (i == 'length') {
				newList[i] = _list[i];
			} else {
				newList['connector'] = {};
				newList['connector']['channelId'] = _list[i]['connector']['channelId'];
				newList['connector']['host'] = _list[i]['connector']['host'];
				newList['connector']['clientPort'] = _list[i]['connector']['clientPort'];
			}
		}
		cb(null, newList);
		
	}
	

}

/**
 * 根据房间号获取端口 ip 等信息
 */
RoomServices.prototype.load = function (roomId, auth, cb) {

	var _curentRoom = this.rooms[roomId];
	if (!_curentRoom) {
		cb('房间不存在')
	}
	if (auth == 'admin') {
		cb(null, _curentRoom)
	} else {

		var roomsInfo = {
			channelId : _curentRoom.channelId,
			connector : {
				host : _curentRoom['connector'].host,
				clientPort : _curentRoom['connector'].clientPort
			}
		}
		cb(null, roomsInfo)

	}

}

/**
 * 根据房间号获取房间内人数信息
 */
RoomServices.prototype.getMembers = function (roomId, cb) {
	
	if (this.rooms[roomId]) {

		var painter = this.rooms[roomId].painter;
		var channelId = this.rooms[roomId].channelId;
		var self = this;

		this.app.rpcInvoke(painter.id, {
			namespace : 'user',
			service : 'painterRemote',
			method : 'get',
			args : [channelId]
		}, function (err, members) {
			cb && cb(err, members);
		})

	} else {
		cb('房间不存在');
	}
	
}

/**
 * 关闭房间
 */
RoomServices.prototype.close = function (roomId, cb) {

	if (this.rooms[roomId]) {

		var connector = this.rooms[roomId].connector;
		var channelId = this.rooms[roomId].channelId;
		var painter = this.rooms[roomId].painter;


		delete this.rooms[roomId];
		this.app.rpcInvoke(painter.id, {
			namespace : 'user',
			service : 'painterRemote',
			method : 'close',
			args : [channelId]
		}, function (err, channel) {
			cb(err || null);
		})
	} else {
		cb('roomId不存在')
	}

}
