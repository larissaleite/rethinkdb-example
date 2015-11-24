// =============== CONFIG ===================

var express  = require('express');
var app      = express(); 							// create app with express

var port  	 = process.env.PORT || 9090; 			// set the port
var connect = require('connect');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var r = require("rethinkdb");

connect()
 .use(cookieParser(''))
 .use(function(req, res, next){
   res.end(JSON.stringify(req.cookies));
 });


// ============== DB Connection ===============
var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;

    //=========== CODE TO CREATE TABLE AND INSERT 3 ROWS ==============

    /*r.db('test').tableCreate('authors').run(connection, function(err, result) {
    	if (err) throw err;
    	console.log(JSON.stringify(result, null, 2));
	
    	r.table('authors').insert([
		    { name: "William Adama", tv_show: "Battlestar Galactica",
		      posts: [
		        {title: "Decommissioning speech", content: "The Cylon War is long over..."},
		        {title: "We are at war", content: "Moments ago, this ship received word..."},
		        {title: "The new Earth", content: "The discoveries of the past few days..."}
		      ]
		    },
		    { name: "Laura Roslin", tv_show: "Battlestar Galactica",
		      posts: [
		        {title: "The oath of office", content: "I, Laura Roslin, ..."},
		        {title: "They look like us", content: "The Cylons have the ability..."}
		      ]
		    },
		    { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
		      posts: [
		        {title: "Civil rights", content: "There are some words I've known since..."}
		      ]
		    }
		]).run(connection, function(err, result) {
		    if (err) throw err;
		    console.log(JSON.stringify(result, null, 2));
		})
	})*/

//r.table("authors").delete().run(connection) // delete everything in table "authors"


})

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

// ================ ROUTES =====================

app.get('/authors', function(req, res) {
	r.table('authors').run(connection, function(err, cursor) {
	    if (err) throw err;
	    cursor.toArray(function(err, result) {
	        if (err) throw err;
	        //console.log(JSON.stringify(result, null, 2));
	        //res.json(result);
	        res.send(JSON.stringify(result, null, 2));
	    });
	});
});

app.get('*', function(req, res) {
	res.sendFile('index.html', { root: __dirname });
});

// ================ INITIALIZATION =====================


app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});