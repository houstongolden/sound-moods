
/*
 * GET moods listing.
 */

var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
if(!server){
	server = process.env.MONGOLAB_URI;
}
db = new Db('heroku_app22789510', server);

function populateDB(){
	db.collection('moods', function(err, collection){
		collection.insert({
			name: 'My Mood',
			color: '#fff',
			tracks: [{name: 'EDX Track', soundCloudId: 'id', soundCloudUrl: 'http://soundcloud.com/edx/trackname'}]},{safe: true}, 
			function(err, result){
			if(!err)
				console.log(result);	
		});
	});
}

db.open(function(err, db){
	db.collection('users', {strict: true}, function(err, collection){
		if(err){
			populateDB();
		}
	});
});

exports.findAll = function(req, res){
	db.collection('moods', function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items);
		});
	});
}

exports.findById = function(req, res){
	var id = req.params.id;
	db.collection('moods', function(err, collection){
		collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item){
			res.send(item);
		});
	});
}

exports.addMood = function(req, res){
	var mood = req.body;
	db.collection('moods', function(err, collection){
		collection.insert(mood, {safe: true}, function(err, result){
			if (err){
				res.send({'error': 'An error has occured'});
			} else {
				res.send(result[0]);
			}
		});
	});
}

exports.updateMood = function(req, res){
	var id = req.params.id;
	var mood = req.body;
	db.collection('moods', function(err, collection){
		collection.update({'_id': new BSON.ObjectID(id)}, mood, {safe:true}, function(err, result){
			if(err){
				res.send({'error': 'An error has occured'});
			} else {
				res.send(mood);
			}
		});
	});
}

exports.deleteMood = function(req, res){
	var id = req.params.id;
	db.collection('moods', function(err, collection){
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result){
			if(err){
				res.send({'error': 'An error has occured'});
			} else {
				res.send(req.body);
			}
		});
	});
}