const fs = require('fs');
const path = require('path');

//Steven Centeno
//completed 3/26/2020


//this function gets the source tree files and returns them in an array
//the upsource tree variable is the full path of the updated source tree
function getProjectTree(UpSourceTreeDir){

    //read files from the source file (is var so that the variable can be used globally aka outside of the method)
    var readFile = require('./ReadFiles')(String(UpSourceTreeDir));
    return readFile.ArrayResult;
}





//gets everything from the target Folder (from the getProjectTree function) and searches through the files and compares it with 
//the files existing in the repository. If the files already exist in there, it gets overwritten (also takes labels into account)
function copyFilesToRepository(RepositoryDir, UpSourceTreeDir){
    
    //gets the files from the source
    let SourceFiles = getProjectTree(UpSourceTreeDir);

    //gets the files in the repository
    let RepDirReader = require('./ReadFiles')(String(RepositoryDir));
    let RepFiles = RepDirReader.ArrayResult;
    
    //creates the new manifest file and saves the manifest file directory
    let location = createManifestFile(RepositoryDir);

    //goes through array of file paths and checks if they are similar to any file in the repository
    //if they are, overwrite them and update the manifest file per file added
    for(let i = 0; i < SourceFiles.len; i++){
    
            //gets the artifact ID of each file and compares it to the 
            let artifact = require('./ArtifactRunner')(String(SourceFiles[i]));
            let fileArtifactId = artifact.getArtifact;


            //copy file to folder, if it already exists, overwrite it
            fs.copyFile(String(SourceFiles[i]), path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + fileArtifactId), (err) => {
                //throws error if could not copy file to destination  
                if (err) throw err;
            });

            //MANIFEST
            //write the file into the manifest file
            let fileInformation = fileArtifactId + "=" + SourceFiles[i] + "\n";

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
    let RepDir =  path.join(RepositoryDir + '\\' +'.Temp');
    let RepDirFiles = require('./ReadFiles')(String(RepDir));
    let RepLatestMani = RepDirFiles.latestManiFile;

    //creates a new manifest file in the repository
    var location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
    fs.appendFile(location, "Commit " + ((Number(RepLatestMani)) + 1)  + ".source:\n", function (err) {

        //throws error if could not append file  
        if (err) throw err;
    });

    return location;
}





//exports the function
module.exports = function(SourceFolder,Repository) {
    return {
        Result : copyFilesToRepository(SourceFolder,Repository)
    };
};