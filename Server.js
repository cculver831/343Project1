var http = require('http');
var bodyparser = require('body-parser'); //Gets HTML body data as key value pair
var express = require('express'); // creates middleware system for pulls, requests
var app = express();
var urlencoderParser = bodyparser.urlencoded({extended: false}); //passes data into this variable
var fs = require('fs'); //requires file system
//Client (HTML) sends request
//Server(this) sends response
app.get('/', urlencoderParser, function(req,res){
res.sendFile(__dirname + '/343ProjectInterface.html'); //puts up html file in the browser
console.log(req.body);
});

// var server = http.createServer(function(req, res){
//   console.log("Request was made: "+ req.url);
// res.writeHead(200,{'Content-Type':'text/html'}); //renders HTML page properly
// var myReadStream = fs.createReadStream(__dirname + '/343ProjectInterface.html', 'utf8'); //specify the name of the file we wish to launch
// myReadStream.pipe(res);
// //Specify port to listen for requests
// });

app.listen(3000, '127.0.0.1'); //locally hosts server from port 3000

console.log('listening to port 3000');