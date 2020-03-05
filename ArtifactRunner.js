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
    var result = 0;
    var temp = 0;
    for (let index = 0; index < filePath.length; index++) {
      if(index % 4 == 0){
        temp += (filePath.charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (filePath.charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (filePath.charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (filePath.charCodeAt(index) * 11);
      }
    }
    result = "P" + temp % 10000 + "-";

    
    var stats = fs.statSync(filePath);
    var fileSizeInBytes = stats["size"];
    result += "L" + (fileSizeInBytes % 100) + "-";


    temp = 0;
    for (let index = 0; index < getContent(filePath).length; index++) {
      if(index % 4 == 0){
        temp += (getContent(filePath).charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (getContent(filePath).charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (getContent(filePath).charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (getContent(filePath).charCodeAt(index) * 11);
      }
    }
    result += "C" + temp % 10000 + ".txt";
    console.log(result);
    return result;
}

CreateArtifact('./MyApp/RIP.txt');