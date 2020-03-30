
// CheckInbtn.addEventListener("click", function(){
//   document.getElementById("Test").innerHTML += "Test for Check InScript";
// });



const fs = require('fs');
const path = require('path');

//Steven Centeno
//completed 3/26/2020

//this file is means to act like a "push" to the repository

//this is used as a global variable to be used by the copy to reposiory file
var ArraySourceLen;





//this function gets the source tree files and returns them in an array
//the upsource tree variable is the full path of the updated source tree
function getProjectTree(UpSourceTreeDir){

    //read files from the source file (is var so that the variable can be used globally aka outside of the method)
    var readFile = require('./ReadFiles')(String(UpSourceTreeDir));
    ArraySourceLen = readFile.ArrayResult.length;
    return readFile.ArrayResult;
}





//gets everything from the source Folder (from the getProjectTree function) and searches through the files and compares it with 
//the files existing in the repository. If the files already exist in there, it gets overwritten (also takes labels into account)
//additionally, it creates a new manifest file and copies all contents copied and overwritten into the manifest file along with the date/time
//and command used to run the check in
function copyFilesToRepository(UpSourceTreeDir, RepositoryDir){
    
    //gets the files from the source
    let SourceFiles = getProjectTree(UpSourceTreeDir);
    
    //creates the new manifest file and saves the manifest file directory
    let location = createManifestFile(RepositoryDir);

    //goes through array of file paths and checks if they are similar to any file in the repository
    //if they are, overwrite them and update the manifest file per file added
    console.log(ArraySourceLen);
    for(let i = 0; i < ArraySourceLen; i++){
    
            //gets the artifact ID of each file and compares it to the 
            let artifact = require('./ArtifactRunner')(String(SourceFiles[i]));


            //copy file to folder, if it already exists, overwrite it
            fs.copyFile(String(SourceFiles[i]), path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + artifact.getArtifact), (err) => {
                //throws error if could not copy file to destination  
                if (err) throw err;
            });

            //MANIFEST
            //write the file into the manifest file
            let fileInformation = artifact.getArtifact + "=" + SourceFiles[i] + "\n";

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

    //append the command line and the arguments into the manifest
    let command = "Command: check-in, " + UpSourceTreeDir + ", " + RepositoryDir;
    fs.appendFile(location, command + "\n", function (err) {
        if (err) throw err;
    });
}





//creates a mainifest file in the repository
//returns the location of the manifest file
function createManifestFile(RepositoryDir){

    //reads the latest manifest file in the repository
    let RepDirFiles = require('./ReadFiles')(String(RepositoryDir));
    let RepLatestMani = RepDirFiles.latestManiFile;

    //creates a new manifest file in the repository
    var location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
    fs.appendFile(location, "Commit " + ((Number(RepLatestMani)) + 1)  + ".source:\n", function (err) {

        //throws error if could not append file  
        if (err) throw err;
    });

    return location;
    
 document.getElementById("Checkinoutput").innerHTML += "Congratulations! CheckIn Complete";
}

function manifestFile(RepositoryDir)
{
    let RepDirFiles = require('./ReadFiles')(String(RepositoryDir));
    let RepLatestMani = RepDirFiles.latestManiFile;

    //creates a new manifest file in the repository
    var location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(RepLatestMani) + ".rc" )
    return location;
}


copyFilesToRepository(targFolder.value, DestFolder.value);


//exports the function
module.exports = function(SourceFolder,Repository) {
    return {
        Result : copyFilesToRepository(SourceFolder,Repository),
        Location : manifestFile(Repository)
    };
};