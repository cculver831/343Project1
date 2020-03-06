//This JS Copies files into a new folder, as well as saving a manifest with the file information

//gets libraries and variables that are outside of this script local scope
const path = require('path')
const fs = require('fs')
let ReadFiles = require('./ReadFiles');
ReadFiles.ArrayResult
var len = ReadFiles.ArrayResult.length

//creates manifest file
fs.appendFile(path.join(path.dirname(__filename) + '\\' + 'MyApp' + '\\' + ".Repository" + "\\"  + "Temp" + "\\" + "Manifest.txt"), "", function (err) {
//throws error if could not append file  
if (err) throw err;
});

//goes through array of file paths and copies them into temp
for(var i = 0; i < len; i++){


    //gets copy of script to use function to get CPL
  let artifact = require('./ArtifactRunner')(String(ReadFiles.ArrayResult[i]));
  //copy file to folder
  fs.copyFile(ReadFiles.ArrayResult[i], path.join(path.dirname(__filename) + '\\' + 'MyApp' + '\\' + ".Repository" + "\\"  + "Temp" + "\\" + artifact.getArtifact), (err) => {
    //throws error if could not copy file to destination  
  if (err) throw err;
  });
  //MANIFEST
  //create file info that will be stored in manifest
  var fileInformation = artifact.getArtifact + "=" + ReadFiles.ArrayResult[i] + "\n";
  //appends info into files (file destination, content, error)
  fs.appendFile(path.join(path.dirname(__filename) + '\\' + 'MyApp' + '\\' + ".Repository" + "\\"  + "Temp" + "\\" + "Manifest.txt"), fileInformation, function (err) {
  if (err) throw err;
  });
}
//append Date and time to manifest
var d = new Date();
fs.appendFile(path.join(path.dirname(__filename) + '\\' + 'MyApp' + '\\' + ".Repository" + "\\"  + "Temp" + "\\" + "Manifest.txt"), d, function (err) {
  if (err) throw err;
});


//gets content of a file due to its path
function getContent(filePath){
  try {
    //read data from file
    const data = fs.readFileSync(filePath, 'utf8')
    return data;
    
  } catch (err) {
    console.error(err);
  }
}

