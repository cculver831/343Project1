//This JS Copies files into a new folder, as well as saving a manifest with the file information

//gets libraries and variables that are outside of this script local scope

//HTML CODE
//Createbtn.addEventListener("click", function(){
  //document.getElementById("Test").innerHTML += "Test from CreateScript: " + targFolder.value + " and " + Destfolder.value;
//});

function copyFiles(sourceFolder,targetFolder)
{
  const path = require('path')
  const fs = require('fs')
  let dir =  path.join(targetFolder + '\\' +'.Temp');

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  console.log("The folder from source:  " + sourceFolder + " hase been copied to destination: " + targetFolder);
  let ReadFiles = require('./ReadFiles')(String(sourceFolder));
  console.log(ReadFiles.ArrayResult);
  let len = ReadFiles.ArrayResult.length;
  
  //creates manifest file
  

  let location = path.join(String(targetFolder) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(ReadFiles.latestManiFile) + 1) + ".rc" )
  fs.appendFile(location, "Commit " + ((Number(ReadFiles.latestManiFile)) + 1)  + ".source:\n", function (err) {
  //throws error if could not append file  
  if (err) throw err;
  });
  
  //goes through array of file paths and copies them into temp
  for(let i = 0; i < len; i++){
  
    //gets copy of script to use function to get CPL
    let artifact = require('./ArtifactRunner')(String(ReadFiles.ArrayResult[i]));
    //copy file to folder
    fs.copyFile(String(ReadFiles.ArrayResult[i]), path.join(String(targetFolder) + "\\"  + ".Temp" + "\\" + artifact.getArtifact), (err) => {
      //throws error if could not copy file to destination  
    if (err) throw err;
    });
    //MANIFEST
    //create file info that will be stored in manifest
    let fileInformation = artifact.getArtifact + "=" + ReadFiles.ArrayResult[i] + "\n";
    //appends info into files (file destination, content, error)
    fs.appendFile(location, fileInformation, function (err) {
    if (err) throw err;
    });
  }
  //append Date and time to manifest
  let d = new Date();
  fs.appendFile(location, d + "\n", function (err) {
    if (err) throw err;
  });
    //document.write("The folder from source:  " + sourceFolder + " hase been copied to destination: " + targetFolder);
    
}

module.exports = function(SourceFolder,TargetFolder) {
  return {
      Result : copyFiles(SourceFolder,TargetFolder)
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

