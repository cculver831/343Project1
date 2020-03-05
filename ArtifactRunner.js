const fs = require('fs');
const path = require('path')
//Hanson Nguyen
//completed 03/04/2020


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



//function to get the content of a file from filepath
function getContent(filePath){
    // try and catch exception if the file path return an error
    try {
      // read the data from the file path argument and return it as the data
      const data = fs.readFileSync(filePath, 'utf8')
      return data
      
    } catch (err) {
      // log the error in the console
      console.error(err)
    }
}

//path.join(path.dirname(__filename) + '\\' + 'MyApp') <-- for getting current filepath

// this CreateArtifact function take in an argument of string for file path. It will handle all the calculation for the PLC
// identification for ArtifactID. After calculation, it will return a string with P----,L--,C----
function CreateArtifact(filePath){
    var result = 0;
    var temp = 0;
    
    //calulation for the file path. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the P part of
    // the artifact
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

    //handle calulation for the L/file size of the artifact. The returned values is then modded by 100 to return the 2 most right
    //values for the part of in the returned artifact
    var stats = fs.statSync(filePath);
    var fileSizeInBytes = stats["size"];
    result += "L" + (fileSizeInBytes % 100) + "-";

    //calulation for the file content. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the C/content part
    //of the artifact
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
    //return the result as "P####-L##-C####.txt"
    return result;
}

CreateArtifact('./MyApp/RIP.txt');