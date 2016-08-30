var dispatcher = require('../../../util/dispatcher');
var async = require('async');

module.exports = function (app, http) {

	var self = this;
	self.app = app;

	http.get('/test', function (req, res) {
		res.send('test use')
	})

	/**
	 * 获取connector服务器的post与host
	 */
	http.post('/api/server/get', function (req, res) {
		
		var roomId = req.body.roomId;
		var connectors = app.getServersByType('connector');
		if (!roomId) {
			res.send({
				code : 500,
				desc : 'roomId不能为空'
			})
			return;
		}

		if (!connectors && connectors.length === 0) {
			res.send({
				code : 500,
				desc : 'connector服务器异常'
			})
			return;
		}

		var rcs = dispatcher.dispatch(roomId, connectors);
		res.send({
			code : 200,
			data : rcs
		})

	})

	/**
	 * 开启房间
	 */
	http.post('/api/room/open', function (req, res) {

		var roomId = req.body.roomId;
		var auth = req.body.auth || 'clent';
		if (!roomId) {
			res.send({
				code : 500,
				desc : 'roomId不能为空'
			})
			return;
		}
		var connectors = self.app.getServersByType('connector');
		var connector = dispatcher.dispatch(roomId, connectors);
		
		self.app.get('roomService').open(roomId, connector, auth, function (err, users) {
			if (err) {
				res.send({
					code : 500,
					desc : err
				})
			} else {
				res.send({
					code : 200,
					data : users
				})
			}
		});

	})

	/**
	 * 获取单个房间端口与ip信息
	 */
	http.post('/api/room/load', function (req, res) {

		var roomId = req.body.roomId;
		var auth = req.body.auth || 'clent'; //若是admin则信息多
		if (!roomId) {
			res.send({
				code : 500,
				desc : '请填写房间号'
			})
		}

		this.app.get('roomService').load(roomId, auth, function (err, roomInfo) {
			if (err) {
				res.send({
					code : 500,
					desc : err
				})
			} else {
				res.send({
					code : 200,
					data : roomInfo
				})
			}
		});

	})

	/**
	 * 获取单个channel内的用户信息
	 */
	http.post('/api/roomMembers/get', function (req, res) {

		var roomId = req.body.roomId;
		if (!roomId) {
			res.send({
				code : 500,
				desc : '请填写房间号'
			})
		}

		this.app.get('roomService').getMembers(roomId, function (err, members) {

			if (err) {
				res.send({
					code : 500,
					desc : err
				})
			} else {
				res.send({
					code : 200,
					data : members
				})
			}

		});
		
	})

	/**
	 * 获得房间列表
	 */
	http.post('/api/room/list', function (req, res) {

		var auth = req.body.auth || 'clent'; //若是admin则信息多

		self.app.get('roomService').list(auth, function (err, list) {
			res.send({
				code : 200,
				data : list
			})
		});

	})

	/**
	 * 关闭房间信息
	 */
	http.post('/api/room/close', function (req, res) {

		var roomId = req.body.roomId;
		this.app.get('roomService').close(roomId, function (err) {
			if (err) {
				res.send({
					code : 500,
					desc : err
				})
			} else {
				res.send({
					code : 200
				})
			}
		});
	
	})
	

}