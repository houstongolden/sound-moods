
var express = require('express');
var routes = require('./routes');
var moods = require('./routes/api');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

// users
// app.get('/moods', moods.findAll);
// app.get('/moods/:id', moods.findById);
// app.post('/moods', moods.addMood);
// app.put('/moods/:id', moods.updateMood);
// app.delete('/moods/:id', moods.deleteMood);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
