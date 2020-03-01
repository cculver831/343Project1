const fs = require('fs');
const path = require('path')
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
function getFiles (dir, targetFold, wantPath, isinNestedFold, myArray){
    
    //gets the current directory (CD/STEVESCOMPUTER//Desktop) (dir should be "__filename" to work 
    //aka. get the name of the file to return its directory)
    var currDirectory;
    if(!isinNestedFold){
        currDirectory = path.dirname(dir);
    }
    else{
        currDirectory = dir;
    }

    //gets all files in the current directory and returns them 
    //fs.readdirsync gets all the files (not the path), and places them in an arrayList
    //(excludes files in folders in the directory ex:myapp folder will return blank)
    var filesInDirectoryAsAnArray = fs.readdirSync(currDirectory);

    //goes through all files in that directory
    if(targetFold == " "){
        for (var i in filesInDirectoryAsAnArray){
            //will be the file name
            var filename;
            //will need this later
            var firstCharInFile = filesInDirectoryAsAnArray[i].charAt(0);
            
            //if want the full path of every file get it, otherwise 
            if(wantPath){
                //merges the two strings so that it will be a full path
                filename = path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]);
            }
            else{
                filename = filesInDirectoryAsAnArray[i];
            }

            //checks to see if the file is a directory, if so go in there and return all files in there
            //will result in nested arraylist if there are folders in folders
            if (path.isAbsolute(filename) && fs.lstatSync(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i])).isDirectory()){
                //recurrisve call will put an array in this array
                
                nestedArray = [];
                nestedArray.push(filename);
                nestedArray.push(getFiles(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]), " ", true, true, nestedArray));
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
        for (var i in filesInDirectoryAsAnArray){

            //once finds the targeted folder goes through it and returns an rray with every file there (except dot files)
            if(filesInDirectoryAsAnArray[i] == targetFold){

                var targetedDirectory = filesInDirectoryAsAnArray[i];
                //need to get the directory again and turn all files in it into a list
                var currDirectoryEmbedded = path.join(path.dirname(dir) + '\\' + targetedDirectory);

                //gets all files in the directory and places them in an array
                var allFilesInTargetedFolder = fs.readdirSync(currDirectoryEmbedded);

                for(var j in allFilesInTargetedFolder){
                    //will be the file name
                    var filename;
                    //will need this later
                    var firstCharInFile = allFilesInTargetedFolder[j].charAt(0);
                    
                    //if want the full path of every file get it, otherwise 
                    if(wantPath){
                        //merges the two strings so that it will be a full path
                        filename = path.join(currDirectoryEmbedded + '\\' + allFilesInTargetedFolder[j]);
                    }
                    else{
                        filename = allFilesInTargetedFolder[j];
                    }

                    //checks to see if the file is a directory, if so go in there and return all files in there
                    //will result in nested arraylist if there are folders in folders------------------------------------------------ currently here
                    if (path.isAbsolute(filename) && fs.lstatSync(path.join(currDirectoryEmbedded + '\\' + allFilesInTargetedFolder[j])).isDirectory()){
                        //recurrisve call will put an array in this array
                        nestedArray = [];
                        nestedArray.push(filename);
                        nestedArray.push(getFiles(path.join(currDirectoryEmbedded + '\\' + allFilesInTargetedFolder[j]), " ", true, true, nestedArray));
                        myArray.push(nestedArray);

                    //will add to the array if the file isnt a dot file and if it actually is a file 
                    //(checks second part because for some reason readdirsync returns an invisible file that doesnt exist as its last value)
                    } else if (path.isAbsolute(filename) && firstCharInFile != '.'){
                        myArray.push(filename);
                    }
                }
            }
        }
    }
    return myArray;
}

function printTheFiles(arryFromGetFiles){
    for(var i in arryFromGetFiles){
        console.log(arryFromGetFiles[i]);
    }
}

//ONLY RUN THIS FUNCTION TO RETURN THE DIRECTORY FILES AS AN ARRAY (also prints the directories) 
//YOU DONT NEED TO CALL ANYTHING ELSE UNLESS YOU WANT SOMETHING SPECIFIC
//RETURNS EVERYTHING IN THE MYAPP FOLDER (change "MyApp" to " " if you want to return all files in the directory including the .js files)
//read documentation in full if you want to mess with full file paths, but as of now everything is preset so that the following will happen:
//this code will read all files in the MyApp folder (excluding dot files (files starting with a dot '.')) and return them in an array 
//(nested array if folders in that folder exist)
function returnAllFilesInDirectory(){
    var FolderArray = getFiles(__filename, "MyApp", true, false, []);
    printTheFiles(FolderArray);
    return FolderArray;
}

//make this function equal to a variable to get the array
returnAllFilesInDirectory();