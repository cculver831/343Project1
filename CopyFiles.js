//This JS Copies files into a new folder, as well as saving a manifest with the file information

//gets libraries and variables that are outside of this script local scope
function copyFiles(sourceFolder,targetFolder)
{
  const path = require('path')
  const fs = require('fs')
  var dir = sourceFolder + '\\.Temp';

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  let ReadFiles = require('./ReadFiles')(sourceFolder);
  
  var len = ReadFiles.ArrayResult.length
  
  //creates manifest file
  




  var location = path.join(targetFolder + "\\"  + ".Temp" + "\\" + ".man" + String(Number(ReadFiles.latestManiFile) + 1) + ".rc" )
  fs.appendFile(location, "Commit " + ((Number(ReadFiles.latestManiFile)) + 1)  + ".source:\n", function (err) {
  //throws error if could not append file  
  if (err) throw err;
  });
  
  //goes through array of file paths and copies them into temp
  for(var i = 0; i < len; i++){
  
    //gets copy of script to use function to get CPL
    let artifact = require('./ArtifactRunner')(String(ReadFiles.ArrayResult[i]));
    //copy file to folder
    fs.copyFile(ReadFiles.ArrayResult[i], path.join(targetFolder + "\\"  + ".Temp" + "\\" + artifact.getArtifact), (err) => {
      //throws error if could not copy file to destination  
    if (err) throw err;
    });
    //MANIFEST
    //create file info that will be stored in manifest
    var fileInformation = artifact.getArtifact + "=" + ReadFiles.ArrayResult[i] + "\n";
    //appends info into files (file destination, content, error)
    fs.appendFile(location, fileInformation, function (err) {
    if (err) throw err;
    });
  }
  //append Date and time to manifest
  var d = new Date();
  fs.appendFile(location, d + "\n", function (err) {
    if (err) throw err;
  });
}

module.exports = function(sourceFolder,targetFolder) {
  return {
      ArrayResult : copyFiles(sourceFolder,targetFolder)
  };
};


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

