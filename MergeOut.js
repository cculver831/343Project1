const fs = require('fs');
const path = require('path');




let ArraySourceLen = 0; // will be the length of the manifest array



//this basically works as a pull that is being done ages after the last pull 
//from the repository, and if there are file collisions (possible because
// its been a long time since the last pull), it will make the user handle these collisions


//repoLoc is the repository
//manifestLoc is a manifest file that is being PULLED from
//branchedRepoLoc is your version of the project that you may have branced out of
//note that all these are directories not the actal file name
function MergeOut(repoLoc, T_BrancedRepoLoc, R_ManifestLoc, command){

    //gets the files from the manifest file and saves into an array
    //[[file path,artifact_id, manifest_path],[],[],[],[],[],[],[]] this array is the files of the manifest file
    let SourceFiles = getfilesManifest(repoLoc, R_ManifestLoc);
    
    //files to later be placed into the manifest
    let manifestFiles = [];

    //goes through array of file paths and checks if they are similar to any file in the repository
    //if they are, overwrite them and update the manifest file per file added
    for(let i = 0; i < ArraySourceLen; i++){

        //first checks if file exists (if directory does not exist must create directories along the way)
        let filePathSearch = SourceFiles[i][0]; //file path from manifest (location of T)
        let fileArtifactIdSearch = SourceFiles[i][1]; // artifact id for file (from manifest) (from R)
        let manifestIDPath = SourceFiles[i][2]; // path to manifest version of the old file (from R)

        //get the folders of the paths for the file searching for and the T branched repo
        let BranchDirFolders = T_BrancedRepoLoc.split("\\"); //splits path of repository into folders
        let fileSearchFolders = filePathSearch.split("\\"); //splits the path of repo version of repository

        //get rid of the last element of the sile search folder because its a file
        fileSearchFolders.pop();

        //start searching through the search folders starting from the length of the repository because they theoretically should
        //have the same amount of elements before new ones in the directory 
        let startingPositionFileSearch = BranchDirFolders.length; //will be the folder location of the repository
        let fileSearchLen = fileSearchFolders.length; //will be folder of repo + any other possible new folders to add to the repo

        //see if the files should be in the repo or in sub folders of the repo
        //if the folder does not exist, create it

        if(fileSearchLen != startingPositionFileSearch){

            let subfolder = T_BrancedRepoLoc; //save the current subfolder path
            while (startingPositionFileSearch != fileSearchLen){
                subfolder = subfolder + "\\" + fileSearchFolders[startingPositionFileSearch]; // add the new subfolder and check if exists

                //check if the folder path exists
                if (!fs.existsSync(subfolder)){
                    fs.mkdirSync(subfolder); //makes directory if doesnt exist
                }

                startingPositionFileSearch += 1;
            }
        }

        //if file does exist in repo, compare the check sums, if the check sums are the same ignore it, if not
        //then its a collision and must handle it
        if (fs.existsSync(filePathSearch)) {

            //access artifactRunner to use getArtifact
            let artifact = require('./ArtifactRunner')(String(filePathSearch));
            
            //get the artifact of filePathSearch
            let Path_aid = artifact.getArtifact;
            
            //check if the new artifact ID == old version of artifact ID
            if (fileArtifactIdSearch == Path_aid){
                
                //copy files form R to T
                fs.copyFile(manifestIDPath, filePathSearch, (err) => {
                
                    //throws error if could not copy file to destination  
                    if (err) throw err;
                });

                //add the new file path to the manifest array
                manifestFiles.push(filePathSearch);
            }

            //if the paths are different then get grandma and rename the current wo with _MT and _MR
            // as well as getting the grandma version of it, named _GM
            else{
                //steal professors social security

                //rename target file (old) 
                //next 3 lines update to have "_MT" to old file
                let suffix_old = path.extname(filePathSearch);
                let updated_old = filePathSearch.substring(0, (filePathSearch.length - suffix_old.length));
                updated_old = updated_old + '_MT' + suffix_old;
                //replaces the name of the file
                fs.rename(filePathSearch, updated_old, function (err) {
                    if (err) throw err;
                    console.log('File Renamed.');
                });

                //add the new file path to the manifest array
                manifestFiles.push(updated_old);


                //copy file form R to T because we renamed the old one
                fs.copyFile(manifestIDPath, filePathSearch, (err) => {
                //throws error if could not copy file to destination  
                if (err) throw err;
                });
                
                //rename target file (old) 
                //next 3 lines update to have "_MR" to old file
                let suffix_new = path.extname(filePathSearch); 
                let updated_new = filePathSearch.substring(0, (filePathSearch.length - suffix_new.length));
                updated_new = updated_new + '_MR' + suffix_new;
                //replaces the name of the file
                fs.rename(filePathSearch, updated_new, function (err) {
                    if (err) throw err;
                    console.log('File Renamed.');
                });

                //add the new file path to the manifest array
                manifestFiles.push(updated_new);

                //copy grandma file(with extension _MG) into target location as well===============================
                //REMEMBER TO ADD EVERY FILE THAT WE COPIED OVER TO AN ARRAY SO WE CAN CREATE A MANIFEST OF SAID FILES

                // let GrandmaManifest;
                // let GrandmaFile;

                // //copy file form R to T because we renamed the old one
                // fs.copyFile(GrandmaFile, filePathSearch, (err) => {
                // //throws error if could not copy file to destination  
                // if (err) throw err;
                // });
                
                // //rename target file (old) 
                // //next 3 lines update to have "_MR" to old file
                // let suffix_Grandma = path.extname(filePathSearch);
                // let updated_Grandma = filePathSearch.substring(0, (str.length - suffix_Grandma.length));
                // updated_Grandma = updated_Grandma + '_MG' + suffix_Grandma;
                // //replaces the name of the file
                // fs.rename(filePathSearch, updated_Grandma, function (err) {
                //     if (err) throw err;
                //     console.log('File Renamed.');
                // });

                // //add the new file path to the manifest array
                // manifestFiles.push(updated_Grandma);
            }
            
        }


        //then if it doesnt exist, copy it over
        else{

            //copy files form R to T
            fs.copyFile(manifestIDPath, filePathSearch, (err) => {
            
                //throws error if could not copy file to destination  
                if (err) throw err;
            });

            //add the new file path to the manifest array
            manifestFiles.push(filePathSearch);
        }
    }

    //create Manifest
    let manifestLocation = createManifestFile(repoLoc);
    
    //copy the files into the manifestwith their artifact ID
    for (let i = 0; i < manifestFiles.length; i++){
        
        //get the path that was aded or updated and get its artifact then add it to the manifest
        let filepath = manifestFiles[i];
        let artifact = require('./ArtifactRunner')(String(filepath));
        let fileAtrifact = artifact.getArtifact;

        let manifestLine = fileAtrifact + "=" + filepath;

        fs.appendFile(manifestLocation, manifestLine +  "\n", function (err) {
        if (err) throw err;
    });
    }

    //append Date and time to manifest
    let d = new Date();
    fs.appendFile(manifestLocation, d + "\n", function (err) {
        if (err) throw err;
    });

    //append the command line and the arguments into the manifest
    let commandstuff = "Command: " + command + "arguments:" + repoLoc + ", " + R_ManifestLoc + ", " + T_BrancedRepoLoc;
    fs.appendFile(manifestLocation, commandstuff + "\n", function (err) {
        if (err) throw err;
    });
};





//creates a mainifest file in the repository
//returns the location of the manifest file
function createManifestFile(repoLoc){

    //reads the latest manifest file in the repository
    let RepDirFiles = require('./ReadFiles')(String(repoLoc));
    let RepLatestMani = RepDirFiles.latestManiFile;

    //creates a new manifest file in the repository
    let location = path.join(String(repoLoc) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
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
//[[file path,artifact id,manifest path],[],[],[],[],[],[],[]]
function getfilesManifest(repoDir, manifestDir){
    let manifestFilesR = [];

    //goes through all files in the manifest and both gets their path and their check sums
    const data = fs.readFileSync(repoDir + "\\.Temp\\" + manifestDir, 'UTF-8'); //gets all lines in the manifest
    let lines = data.split(/\r?\n/);  //separates all lines into an array in the manifest

    //goes through each line in the manifest
    //if the file starts with a P that infers that the line is a check sum
    //meaning its a valid file and not a date or command
    for(let i = 0; i < lines.length; i++){
        let line = lines[i]; //gets a single line from the array of lines
        let FileSum = []; //this will be an array holding both the checksum(artifact id) and the file directory

        //checks if its a checksum 
        if(line[0] == "P"){
            let checkSum_FilePath = line.split("="); //makes an array separating the check sum and the path
            FileSum.push(checkSum_FilePath[1])//add the path first
            FileSum.push(checkSum_FilePath[0])//add the check sum (artifact ID) second

            //now get the manifest path and add it to the Filesum array
            let manifestPath = repoDir + "\\.Temp\\" + FileSum[1];
            FileSum.push(manifestPath);

            //now add the path and check sum to the entire Folder
            manifestFilesR.push(FileSum);

            ArraySourceLen += 1;
        }
    }  

    //returns all file paths along with their check sums
    return manifestFilesR;
};




MergeOut('C:\\Users\\steve\\Desktop\\Target','C:\\Users\\steve\\Desktop\\Source', '.man1.rc', "commands");