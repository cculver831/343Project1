const fs = require('fs');
const path = require('path')
//Hanson Nguyen
//completed not yet


//     ***Chloe please take this***
// var http = require('http');
// var fs = require('fs');
// const PORT=8080; 
// //go to http://localhost:8080
// fs.readFile('./343ProjectInterface.html', function (err, html) {
//     if (err) throw err;    

//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(PORT);
// });




// for self dont touch
// var versionName = '.versions.txt'

// function updateRepo(folderName){
//     if (!fs.existsSync('MyApp\\' + '.' + folderName)) {
//         fs.mkdirSync('MyApp\\' + '.' + folderName);
//         fs.mkdirSync('MyApp\\' + '.' + folderName + '\\' + versionName);
//     }  
//     fs.writeFile('MyApp\\' + '.' + folderName + '\\' + versionName + '\\', 'Versions of Artifacts', function (err) {
//         if (err) throw err;
//         console.log('Version sucessfully updated');
//         });  
           
// }
var FileProcessor = require('./FileProcessor.js');

function getContent(filePath){
    const fs = require('fs')
  
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      return data
      
    } catch (err) {
      console.error(err)
    }
}
function CreateArtifact(filePath){
    var total = 0;
    for (let index = 0; index < getContent(filePath).length; index++) {
        total += getContent(filePath).charCodeAt(index);
    }
    console.log(total);
}

CreateArtifact('./MyApp/RIP.txt');