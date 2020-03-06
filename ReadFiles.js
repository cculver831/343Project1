const fs = require('fs');
const path = require('path');
//Steven Centeno
//completed 2/28/2020       




//I use the word directory and file path a lot in here so directory or file path = (ex: cd/StevesComputer//Desktop//Project343Folder)
//Takes in the current directory ("__filename" to get current directory), and returns all files in the current directory (except dot files)
//as an array (including folders and files in those folders)

//WILL RETURN NESTED ARRAY [file,[directory,files in the directory],[directory2,files in directory2],file, [directory3,files in directory3], file] 
//ONLY IF THERE ARE FOLDERS IN FOLDERS IN THIS DIRECTORY

// dir = directory as a string, targetFold = name of target folder (only look in this one) as a string " " if no target
//wantPath =  boolean to return the whole path of the files too, true to return whole path, false to only return file
//inNestedFold = used in recurrive call to determine whether the file is in another file (had to use to make recurrsion work)
//myArray = an array you put into the function to better use recurrsion (sorry is kinda ugly right now)
function getFiles (dir, targetFold, wantPath, isinNestedFold){
    let myArray = [];
    
    //gets the current directory (CD/STEVESCOMPUTER//Desktop) (dir should be "__filename" to work 
    //aka. get the name of the file to return its directory)
    let currDirectory = path.dirname(dir);
    
    //used to help recurrsion
    if(targetFold == " " && isinNestedFold){
        currDirectory = dir;
    }

    //gets all files in the current directory and returns them 
    //fs.readdirsync gets all the files (not the path), and places them in an arrayList
    //(excludes files in folders in the directory ex:myapp folder will return blank)
    let filesInDirectoryAsAnArray = fs.readdirSync(currDirectory);

    //goes through all files in that directory
    if(targetFold == " "){
        for (let i in filesInDirectoryAsAnArray){
            //will be the file name
            let filename;
            //will need this later
            let firstCharInFile = filesInDirectoryAsAnArray[i].charAt(0);
            
            //if want the full path of every file get it, otherwise 
            if(wantPath){
                //merges the two strings so that it will be a full path
                filename = path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]);
            }
            else{
                filename = filesInDirectoryAsAnArray[i];
            }

            if(fs.lstatSync(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i])).isDirectory()){
                firstCharInFile = path.basename(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i])).charAt(0);
            }

            //checks to see if the file is a directory, if so go in there and return all files in there
            //will result in nested arraylist if there are folders in folders, except dot folders
            if (path.isAbsolute(filename) && fs.lstatSync(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i])).isDirectory() && firstCharInFile != '.'){
                //recurrisve call will put an array in this array
                
                let nestedArray = [];
                nestedArray.push(filename);
                let embeddedArray = getFiles(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]), " ", true, true);
                nestedArray.push(embeddedArray);
                myArray.push(nestedArray);

            //will add to the array if the file isnt a dot file and if it actually is a file 
            //(checks second part because for some reason readdirsync returns an invisible file that doesnt exist as its last value)
            } else if (path.isAbsolute(filename) && firstCharInFile != '.'){
                myArray.push(filename);
            }
        }
    }

    else{
        
        //Looks for the targeted folder
        for (let i in filesInDirectoryAsAnArray){

            //once finds the targeted folder goes through it and returns an rray with every file there (except dot files)
            if(filesInDirectoryAsAnArray[i] == targetFold){

               return getFiles(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]), " ", true, true);
            }
        }
    }
    return myArray;
}

//both prints the files and returns all the files into an array with everything besides the direcroties (includes files in other folders)
//returns the final array containing all the files (no nested arrays will exist in the final array made the mistake of doing so earlier but corrected it)
function printTheFilesAndReturnArray(arryFromGetFiles, finalArrayToInsertTo){

    for(let i in arryFromGetFiles){

        //uses recurrsion if there is an array in an array to get the files in the directories
        if(Array.isArray(arryFromGetFiles[i])){
            printTheFilesAndReturnArray(arryFromGetFiles[i], finalArrayToInsertTo);
        }

        else{
            if(!fs.lstatSync(arryFromGetFiles[i]).isDirectory()){
                console.log(arryFromGetFiles[i]);
                finalArrayToInsertTo.push(arryFromGetFiles[i]);
            }
        }
    }
}

//ONLY RUN THIS FUNCTION TO RETURN THE DIRECTORY FILES AS AN ARRAY (also prints the directories) 
//YOU DONT NEED TO CALL ANYTHING ELSE UNLESS YOU WANT SOMETHING SPECIFIC
//RETURNS EVERYTHING IN THE MYAPP FOLDER (change "MyApp" to " " if you want to return all files in the directory including the .js files)
//read documentation in full if you want to mess with full file paths, but as of now everything is preset so that the following will happen:
//this code will read all files in the MyApp folder (excluding dot files (files starting with a dot '.')) and return them in an array 
//(nested array if folders in that folder exist)
function returnAllFilesInDirectory(){
    let FolderArray = getFiles(__filename, "MyApp", true, false, []);
    console.log('All Files and folders in the Folder MyApp (excluding dot files/folders) \n');
    let FinalArray = [];
    printTheFilesAndReturnArray(FolderArray, FinalArray);
    return FinalArray;
}

//Reads the current highest number Manifest Files in The Repository
function getLatestManifestNum(){

    //current filename
    let currDir = path.dirname(__filename);
    
    //goes to the temp directory directly (change the temp into any directory name if you change the name)
    let manifestDir = path.join(currDir + '\\' + 'MyApp' + '\\' + '.Repository' + '\\' + 'Temp');

    //gets an array of everything in the path
    let manifestFilesInDir = fs.readdirSync(manifestDir);

    let latestManiFile = 0;
    for(let i in manifestFilesInDir){

        let filename = manifestFilesInDir[i];
        //manifest files names .man<int>.rc accordingly
        if(filename.length > 4 && path.basename(filename.substring(0,4)) == '.man'){
            latestManiFile = filename.charAt(4);
        }
    }
    return latestManiFile;
    
}

//this returns the array to be used by other javascript files just put .ArrayResult After the 
exports.ArrayResult = returnAllFilesInDirectory();
exports.latestManiFile = getLatestManifestNum();