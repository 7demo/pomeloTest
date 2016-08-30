/**
 * 把roomid 转成 channel的id
 */
var crypto = require('crypto');

module.exports = function (roomId) {
	try {
		var buf = crypto.createHash('md5').update(new Date().getTime.toString()).digest('hex').substr(0, 16).toUpperCase();
		return buf;
	} catch (e) {
		return roomId;
	}
}