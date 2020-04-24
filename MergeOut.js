const fs = require('fs');
const path = require('path');


let ArraySourceLen;



//this basically works as a pull that is being done ages after the last pull 
//from the repository, and if there are file collisions (possible because
// its been a long time since the last pull), it will make the user handle these collisions

//all of these are directories:-------
//repoLoc is the repository
//manifestLoc is a manifest file that is being PULLED from
//branchedRepoLoc is your version of the project that you may have branced out of
function MergeOut(repoLoc, T_BrancedRepoLoc, R_ManifestLoc){
    
    //gets the files from the source
    let SourceFiles = getProjectTree(R_ManifestLoc);

    //creates the new manifest file and saves the manifest file directory
    //let location = createManifestFile(T_BrancedRepoLoc); ------------------------------

    //goes through array of file paths and checks if they are similar to any file in the repository
    //if they are, overwrite them and update the manifest file per file added
    console.log(ArraySourceLen);
    for(let i = 0; i < ArraySourceLen; i++){
    
            //gets the artifact ID of each file and compares it to the 
            let artifact = require('./ArtifactRunner')(String(SourceFiles[i]));


            //copy file to folder, if it already exists, overwrite it
            fs.copyFile(String(SourceFiles[i]), path.join(String(T_BrancedRepoLoc) + "\\"  + ".Temp" + "\\" + artifact.getArtifact), (err) => {
                //throws error if could not copy file to destination  
                if (err) throw err;
            });

            //MANIFEST
            //write the file into the manifest file
            //let fileInformation = artifact.getArtifact + "=" + SourceFiles[i] + "\n"; ----------------------------------

            //appends info into files (file destination, content, error) ----------------------
            //fs.appendFile(location, fileInformation, function (err) { -----------------------------------------------
            //    if (err) throw err; ----------------------------------------------------------
            //});
    }

    //append Date and time to manifest
    let d = new Date();
    fs.appendFile(location, d + "\n", function (err) {
        if (err) throw err;
    });

    //append the command line and the arguments into the manifest
    let command = "Command: check-in, " + R_ManifestLoc + ", " + T_BrancedRepoLoc;
    fs.appendFile(location, command + "\n", function (err) {
        if (err) throw err;
    });
}





//creates a mainifest file in the repository
//returns the location of the manifest file
function createManifestFile(T_BrancedRepoLoc){

    //reads the latest manifest file in the repository
    let RepDirFiles = require('./ReadFiles')(String(T_BrancedRepoLoc));
    let RepLatestMani = RepDirFiles.latestManiFile;

    //creates a new manifest file in the repository
    let location = path.join(String(T_BrancedRepoLoc) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
    fs.appendFile(location, "Commit " + ((Number(RepLatestMani)) + 1)  + ".source:\n", function (err) {

        //throws error if could not append file  
        if (err) throw err;
    });

    return location;
    
}





//this function gets the repository files and returns them in an array
//the upsource tree variable is the full path of the updated repository that branched earlier
function getProjectTree(R_ManifestLoc){

    //read files from the source file (is var so that the variable can be used globally aka outside of the method)
    let readFile = require('./ReadFiles')(String(R_ManifestLoc));
    ArraySourceLen = readFile.ArrayResult.length;
    return readFile.ArrayResult;
}