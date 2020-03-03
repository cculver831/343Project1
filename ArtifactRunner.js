//Hanson Nguyen
//completed not yet
var http = require('http');
var fs = require('fs');
const PORT=8080; 
//go to http://localhost:8080
fs.readFile('./343ProjectInterface.html', function (err, html) {
    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});

var versionName = '.versions.txt'

function updateRepo(folderName){
    if (!fs.existsSync('MyApp\\' + '.' + folderName)) {
        fs.mkdirSync('MyApp\\' + '.' + folderName);
        fs.mkdirSync('MyApp\\' + '.' + folderName + '\\' + versionName);
    }
        
        
        
        
    fs.writeFile('MyApp\\' + '.' + folderName + '\\' + versionName + '\\', 'Versions of Artifacts', function (err) {
        if (err) throw err;
        console.log('Version sucessfully updated');
        });  
           
}
console.log("Kill me");
console.log(module);
updateRepo("Repository");