//Copies Content into new file using targets

const path = require('path')
const fs = require('fs')
let ReadFiles = require('./ReadFiles');
ReadFiles.ArrayResult


var len = ReadFiles.ArrayResult.length
//testing
console.log("Before loop")
console.log(ReadFiles.ArrayResult.toString)
console.log("After Loop")

//create manifest file
fs.appendFile("Manifest.txt", '', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

//goes through array of file paths and copies into temp
for(var i = 0; i < len; i++){
    console.log(String(ReadFiles.ArrayResult[i]))
    //copy file to folder
    fs.copyFile(ReadFiles.ArrayResult[i], path.join(path.dirname(__filename) + '\\' + 'MyApp' + '\\' + ".Repository" + "\\"  + "Temp" + "\\" + path.basename(ReadFiles.ArrayResult[i])), (err) => {
        if (err) throw err;
        console.log('File was copied to destination');
      });
      
    //append information into the manifest
    var fileInformation = "CLP NAME" + "=" + ReadFiles.ArrayResult[i] + "\n";
    //appends info into files (file destination, content, error)
    fs.appendFile("Manifest.txt", fileInformation, function (err) {
        if (err) throw err;
        console.log('Manifest Updated!');
      });
}
//append Date and time to manifest
var d = new Date();
fs.appendFile("Manifest.txt", d, function (err) {
    if (err) throw err;
    console.log('Manifest Updated!');
  });

//create and append command line on top of manifest.txt
//loop-
//copy file into temp(fs.copyfile)
//append "CPL name" + "=" + FolderDestination onto manifest

//after loop, date and time





function getContent(filePath){
    
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      return data;
      
    } catch (err) {
      console.error(err);
    }
}

