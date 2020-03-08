var fs = require('fs');
var express = require("express");
var app     = express();

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/Text.html'));
  //__dirname : It will resolve to your project folder.
});

//loading all files in public folder
//see instructions in https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.listen(8080);

console.log("Running at Port 8080");