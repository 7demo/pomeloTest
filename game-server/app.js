var pomelo = require('pomelo');
var painterRoute = require('./app/util/painterRoute.js');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

// app configuration
app.configure('production|development', function(){
  app.route('painter', painterRoute);
  app.enable('systemMonitor'); //开启监控系统 必须lunix 安装 apt-get sysstat
});

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
      heartbeat : 20,
      useDict : true,
      useProtobuf : true
    });
});



//error
app.set('errorHandler', function (err, msg, resp, session, cb) {
  console.error(err)
})

// start app
app.start();


process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
