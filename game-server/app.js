var pomelo = require('pomelo');
var httpPlugin = require('pomelo-http-plugin');
var path = require('path');
var RoomService = require('./app/services/roomService');
var PainterRoute = require('./app/util/painterRoute');


/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

// app.configure(function(){
//   app.enable('systemMonitor'); //开启监控系统 必须lunix 安装 apt-get sysstat
// });

app.configure('development|production', 'http', function () {
  app.loadConfig('httpConfig', path.join(app.getBase(), 'config/http.json'));
  app.use(httpPlugin, {
    http : app.get('httpConfig')[app.getServerId()]
  })
})

app.configure('production|development', 'gate', function () {
	app.set('connectorConfig', {
		connector : pomelo.connectors.hybridconnector
	})
})

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      // heartbeat : 20,
      useDict : true,
      useProtobuf : true
    });
});

// app configuration 主要配置后端服务器
app.configure('production|development', function(){
  app.route('painter', PainterRoute);
});


//error
app.set('errorHandler', function (err, msg, resp, session, cb) {
  console.error(err)
})
//设置服务
app.set('roomService', new RoomService(app));

// start app
app.start();


process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
