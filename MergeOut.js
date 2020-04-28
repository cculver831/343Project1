const fs = require('fs');
const path = require('path');


let ArraySourceLen; // will be the length of the manifest array



//this basically works as a pull that is being done ages after the last pull 
//from the repository, and if there are file collisions (possible because
// its been a long time since the last pull), it will make the user handle these collisions


//repoLoc is the repository
//manifestLoc is a manifest file that is being PULLED from
//branchedRepoLoc is your version of the project that you may have branced out of
//note that all these are directories not the actal file name
function MergeOut(repoLoc, T_BrancedRepoLoc, R_ManifestLoc){
    
    //gets the files from the manifest file and saves into an array
    //[[file path,artifact id],[],[],[],[],[],[],[]] this array is the files of the manifest file
    let SourceFiles = getfilesManifest(repoLoc, R_ManifestLoc);

    //creates the new manifest file and saves the manifest file directory
    //let location = createManifestFile(T_BrancedRepoLoc); ------------------------------

    //goes through array of file paths and checks if they are similar to any file in the repository
    //if they are, overwrite them and update the manifest file per file added
    for(let i = 0; i < ArraySourceLen; i++){

        //first checks if file exists (if directory does not exist must create directories along the way)

        
        //then if it doesnt exist, copy it over

        //if it does exist, compare the check sums, if the check sums are the same ignore it, if not
        //do merge collisions

        //=========================================================================================

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
};





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
    
};





//this function takes in the manifest location and repository directory
//and returns all files that are associated with that maifest file
//as well as their corresponding check sums
//returns these values in a 2d array in the formatt
//[[file path,artifact id],[],[],[],[],[],[],[]]
function getfilesManifest(repoDir, manifestDir){
    let manifestFilesR = [];

    //goes through all files in the manifest and both gets their path and their check sums
    const data = fs.readFileSync(repoDir + "\\.Temp\\" + manifestDir, 'UTF-8'); //gets all lines in the manifest
    let lines = data.split(/\r?\n/);  //separates all lines into an array in the manifest
    ArraySourceLen = lines.length; // make the length of lines the length of arrays

    //goes through each line in the manifest
    //if the file starts with a P that infers that the line is a check sum
    //meaning its a valid file and not a date or command
    for(let i = 0; i < ArraySourceLen; i++){
        let line = lines[i]; //gets a single line from the array of lines
        FileSum = []; //this will be an array holding both the checksum(artifact id) and the file directory

        //checks if its a checksum 
        if(line[0] == "P"){
            let checkSum_FilePath = line.split("="); //makes an array separating the check sum and the path
            FileSum.push(checkSum_FilePath[1])//add the path first
            FileSum.push(checkSum_FilePath[0])//add the check sum (artifact ID) second
        }

        //now add the path and check sum to the entire Folder
        manifestDir.push(FileSum)
    }  

    //returns all file paths along with their check sums
    return manifestFilesR;
};