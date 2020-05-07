// READ FILE STARTS HERE ============================================================================================================
//======================================================================================================================================
//=====================================================================================================================================



//Createbtn.addEventListener("click", function(){
//  document.getElementById("Test").innerHTML += "Test from CreateScript: " + targFolder.value + " and " + Destfolder.value;
//});
copyFiles('C:\\Users\\steve\\Desktop\\Source','C:\\Users\\steve\\Desktop\\Target');


const fs = require('fs');
const path = require('path');

//I use the word directory and file path a lot in here so directory or file path = (ex: cd/StevesComputer//Desktop//Project343Folder)
//Takes in the current directory ("__filename" to get current directory), and returns all files in the current directory (except dot files)
//as an array (including folders and files in those folders)

//WILL RETURN NESTED ARRAY [file,[directory,files in the directory],[directory2,files in directory2],file, [directory3,files in directory3], file] 
//ONLY IF THERE ARE FOLDERS IN FOLDERS IN THIS DIRECTORY

// dir = directory as a string, targetFold = name of target folder (only look in this one) as a string " " if no target
//wantPath =  boolean to return the full path of the files too, true to return whole path, false to only return file
//targetFold = the folder that you would want to target in the directory you give [(" ") if you want everything in that directory]
function getFiles (dir, targetFold, wantPath){
    let myArray = [];
    
    //gets the current directory (CD/STEVESCOMPUTER//Desktop) (dir should be "__filename" to work 
    //aka. get the name of the file to return its directory)
    let currDirectory = dir;

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
                let embeddedArray = getFiles(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]), " ", true);
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

               return getFiles(path.join(currDirectory + '\\' + filesInDirectoryAsAnArray[i]), " ", true);
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
function returnAllFilesInDirectory(userGivenPath){
    const fs = require('fs');
    const path = require('path');
    let FolderArray = getFiles(userGivenPath, " ", true);
    let FinalArray = [];
    printTheFilesAndReturnArray(FolderArray, FinalArray);
    return FinalArray;
}

//Reads the current highest number Manifest Files in The Repository
function getLatestManifestNum(userGivenPath){
    const fs = require('fs');
    const path = require('path');
    
    //goes to the temp directory directly (change the temp into any directory name if you change the name)
    let manifestDir = path.join(userGivenPath + '\\' + '.Temp');

    //if the temp file does not already exist, it will not check for it, this is to avoid creating a new temp file when looking through
    //the source file
    if (!fs.existsSync(manifestDir)){
        return 0;
    }

    //gets an array of everything in the path
    let manifestFilesInDir = fs.readdirSync(manifestDir);

    let latestManiFile = 0;
    for(let i in manifestFilesInDir){

        let filename = manifestFilesInDir[i];
        //manifest files names .man<int>.rc accordingly, this lists the latest (biggest) num of mainifest files
        if(filename.length > 4 && path.basename(filename.substring(0,4)) == '.man' 
        && Number.parseInt(filename.substring(4, filename.indexOf('.', 4) + 1)) > latestManiFile){

            //get the number in the manifest file
            let num = filename.substring(4, filename.indexOf('.', 4) + 1);
            latestManiFile = Number.parseInt(num) * 1;
        }
    }
    console.log(latestManiFile);
    return latestManiFile;
    
}
//end of readfiles ============================================================================================================================
//=================================================================================================================================================
//=========================================================================================================================================














//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
function copyFiles(sourceFolder,targetFolder)
{
  let dir =  path.join(targetFolder + '\\' +'.Temp');

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  console.log("The folder from source:  " + String(sourceFolder) + " hase been copied to destination: " + String(targetFolder));
  console.log(returnAllFilesInDirectory(sourceFolder));
  let len = returnAllFilesInDirectory(sourceFolder).length;
  
  //creates manifest file
  

  let location = path.join(String(targetFolder) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(getLatestManifestNum(sourceFolder)) + 1) + ".rc" )
  fs.appendFile(location, "Commit " + ((Number(getLatestManifestNum(sourceFolder))) + 1)  + ".source:\n", function (err) {
  //throws error if could not append file  
  if (err) throw err;
  });
  
  //goes through array of file paths and copies them into temp
  for(let i = 0; i < len; i++){
  
    //gets copy of script to use function to get CPL
    //copy file to folder
    fs.copyFile(String(returnAllFilesInDirectory(sourceFolder)[i]), path.join(String(targetFolder) + "\\"  + ".Temp" + "\\" + CreateArtifact(String(returnAllFilesInDirectory(sourceFolder)[i]))), (err) => {
      //throws error if could not copy file to destination  
    if (err) throw err;
    });
    
    //MANIFEST
    //create file info that will be stored in manifest
    let fileInformation = CreateArtifact(String(returnAllFilesInDirectory(sourceFolder)[i])) + "=" + String(returnAllFilesInDirectory(sourceFolder)[i]) + "\n";
    console.log("REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    console.log(location)
    console.log(fileInformation)
    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
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
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================










//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
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

//////ARTIFACT CODE STARTS HERE
//Hanson Nguyen
//completed 03/04/2020



//function to get the content of a file from filepath
function getContent(filePath){
    const fs = require('fs');
    const path = require('path');
    // try and catch exception if the file path return an error
    try {
      // read the data from the file path argument and return it as the data
      const data = fs.readFileSync(filePath, 'utf8')
      return data
      
    } catch (err) {
      // log the error in the console
      console.error(err)
    }
}

//path.join(path.dirname(__filename) + '\\' + 'MyApp') <-- for getting current filepath

// this CreateArtifact function take in an argument of string for file path. It will handle all the calculation for the PLC
// identification for ArtifactID. After calculation, it will return a string with P----,L--,C----
function CreateArtifact(filePath){
    const fs = require('fs');
    const path = require('path');
    let result = 0;
    let temp = 0;
    
    //calulation for the file path. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the P part of
    // the artifact
    for (let index = 0; index < filePath.length; index++) {
      if(index % 4 == 0){
        temp += (filePath.charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (filePath.charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (filePath.charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (filePath.charCodeAt(index) * 11);
      }
    }
    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the Path
    if(temp <10){
      result = "P000" + temp + "-";
    }
    else if(temp <100){
      result = "P00" + temp + "-";
    }
    else if( temp < 1000 ){
      result = "P0" + temp+ "-";
    }
    else{
      
      if(temp % 10000 <10){
        result = "P000" + temp % 10000 + "-";
      }
      else if(temp % 10000 <100){
        result = "P00" + temp % 10000 + "-";
      }
      else if(temp % 10000 < 1000 ){
        result = "P0" + temp % 10000+ "-";
      }
      else{
        result = "P" + temp % 10000 + "-";
      }
    }

    //handle calulation for the L/file size of the artifact. The returned values is then modded by 100 to return the 2 most right
    //values for the part of in the returned artifact
    let stats = fs.statSync(filePath);
    let fileSizeInBytes = stats["size"];

    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the File size in byte
    if(fileSizeInBytes < 10){
      result += "L0" + (fileSizeInBytes % 100) + "-";
    }
    else{
      if(fileSizeInBytes % 100 < 10){
        result += "L0" + (fileSizeInBytes % 100) + "-";
      }
      else{
        result += "L" + (fileSizeInBytes % 100) + "-";
      }     
    }
    

    //calulation for the file content. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the C/content part
    //of the artifact
    temp = 0;
    for (let index = 0; index < getContent(filePath).length; index++) {
      if(index % 4 == 0){
        temp += (getContent(filePath).charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (getContent(filePath).charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (getContent(filePath).charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (getContent(filePath).charCodeAt(index) * 11);
      }
    }
    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the Content
    if(temp <10){
      result += "C000" + temp % 10000 +  ".txt";
    }
    else if(temp <100){
      result += "C00" + temp % 10000 +  ".txt";
    }
    else if(temp <1000){
      result += "C0" + temp % 10000 +  ".txt";
    }
    else{
      if(temp % 10000 < 10){
        result += "C000" + temp % 10000 + ".txt";
      }
      else if(temp % 10000 < 100){
        result += "C00" + temp % 10000 + ".txt";
      }
      else if(temp % 10000 < 1000 ){
        result += "C0" + temp % 10000+ ".txt";
      }
      else{
        result += "C" + temp % 10000 + ".txt";
      }
    }
    console.log(result);
    //return the result as "P####-L##-C####.txt"
    return result;
}


//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================


//Steven Centeno
//completed 3/26/2020

//this file is means to act like a "push" to the repository

//this is used as a global variable to be used by the copy to reposiory file
var ArraySourceLen;


//this function gets the source tree files and returns them in an array
//the upsource tree variable is the full path of the updated source tree
function getProjectTree(UpSourceTreeDir){

    //read files from the source file (is var so that the variable can be used globally aka outside of the method)
    var readFile = returnAllFilesInDirectory(String(UpSourceTreeDir));
    ArraySourceLen = readFile.length;
    return readFile;
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
            let artifact = CreateArtifact(String(SourceFiles[i]));


            //copy file to folder, if it already exists, overwrite it
            fs.copyFile(String(SourceFiles[i]), path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + artifact), (err) => {
                //throws error if could not copy file to destination  
                if (err) throw err;
            });

            //MANIFEST
            //write the file into the manifest file
            let fileInformation = artifact + "=" + SourceFiles[i] + "\n";

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
    let RepLatestMani = getLatestManifestNum(String(RepositoryDir));

    //creates a new manifest file in the repository
    var location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
    fs.appendFile(location, "Commit " + ((Number(RepLatestMani)) + 1)  + ".source:\n", function (err) {

        //throws error if could not append file  
        if (err) throw err;
    });

    return location;
    
// document.getElementById("Checkinoutput").innerHTML += "Congratulations! CheckIn Complete";
}

function manifestFile(RepositoryDir)
{
    let RepLatestMani = getLatestManifestNum(String(RepositoryDir));

    //creates a new manifest file in the repository
    var location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(RepLatestMani) + ".rc" )
    return location;
}



//exports the function
module.exports = function(SourceFolder,Repository) {
    return {
        Result : copyFilesToRepository(SourceFolder,Repository),
        Location : manifestFile(Repository)
    };
};


//==================================================================================================================================
//==================================================================================================================================
//====================================================================================================================End of checkin



//Hanson Nguyen
/**
 * Checkout Feature:
 * allows the user to copy files from the version control into and existing folder
 */
 //paramater passed through will be source repository, destination, and manifest file name or label
 //the character '|' means there is a label

 function CheckOut(repo, dest, manif)
 {
     let files = fs.readdirSync(String(repo + "\\.Temp")); 

     try{
         //Create Folder with dir directory if the manifest/label exist and folder doesn't exist
         if (!fs.existsSync(dest)){
             fs.mkdirSync(dest);
         }
         //print the array to check if everything seems correct
         //console.log(lines);
 
         
         //Check if the argument passed into the manifest is a file is a valid manifest file
         if(manif.slice(-2) == 'rc')
         {
             // read contents of the file
             let data = fs.readFileSync(repo + "\\.Temp\\" + manif, 'UTF-8');
             let lines = data.split(/\r?\n/);
 
             // Loops through the data in the confirmed manifest file and carry logic accordingly
             for(let i = 0; i < lines.length; i++)
             {
                 let line = lines[i];
                 // Check if the first letter of the line is P for the file 
                 if(line[0] == "P")
                 {
                     let comp = line.split("=");
                     console.log(comp);
                     let folders = comp[1].split("\\");
                     folders.splice(0,1);
                     let name = folders.pop();
                     // Loop through each components folder of the path and ger rid of
                     for(let index = 0; index < folders.length; index++)
                     {
                         // Add the directory folders with the last folders, ending result will be the full path of the folder
                         if(index != 0)
                         {
                             folders[index] = folders[index-1] + "\\" +  folders[index];
                         }
                     }
 
                     console.log(folders);
                     // Make the folder indiviually with the given path from the beginning to end
                     for(let a = 0; a < folders.length; a++)
                     {
                         if (!fs.existsSync(dest + "\\" + folders[a])){
                             fs.mkdirSync(dest + "\\" + folders[a]);
                         }
                     }
                     
                     //copy files to those newly created folders
                     fs.copyFile(String(repo + "\\.Temp\\" + comp[0]), String(dest + "\\" + folders[folders.length-1] + "\\" + name), (err) => {
                         //throws error if could not copy file to destination  
                       if (err) throw err;
                     });
 
                 }
             }   
             console.log("Completed Command");
         }
         // else if to check if the user passed in a valid foratted label
         else if(manif[0] == '|')
         {
             for(let i = 0; i < files.length; i++)
             {
                 if(files[i].slice(-2) == "rc")
                 {
                     // read contents of the file
                     let data = fs.readFileSync(repo + "\\.Temp\\" + files[i], 'UTF-8');
                     let lines = data.split(/\r?\n/);
                     //check is the first line of the manifest
                     let check = lines[0];
                     if(check[0] == '|')
                     {
                         // split out the first lines to check if there's any labels
                         let labels = check.split("|");
                         // for loops to check if the labels the user inputted in the manifest file
                         for(let i = 0; i < labels.length; i++)
                         {
                             if(labels[i] != "" &&  "|"+ labels[i] == manif)
                             {
 
                                 // go through each lines to check for artifact name and file data
                                 for(let i = 0; i < lines.length; i++)
                                 {
                                     let line = lines[i];
                                     // Check if the first letter of the line is P for the file 
                                     if(line[0] == "P")
                                     {
                                         let comp = line.split("=");
                                         console.log(comp);
                                         let folders = comp[1].split("\\");
                                         folders.splice(0,1);
                                         let name = folders.pop();
                                         // Loop through each components folder of the path and ger rid of
                                         for(let index = 0; index < folders.length; index++)
                                         {
                                             // Add the directory folders with the last folders, ending result will be the full path of the folder
                                             if(index != 0)
                                             {
                                                 folders[index] = folders[index-1] + "\\" +  folders[index];
                                             }
                                         }
                                         
                                         console.log(folders);
                                         // Make the folder indiviually with the given path from the beginning to end
                                         for(let a = 0; a < folders.length; a++)
                                         {
                                             if (!fs.existsSync(dest + "\\" + folders[a])){
                                                 fs.mkdirSync(dest + "\\" + folders[a]);
                                             }
                                         }
                                         //copy files to those newly created folders
                                         fs.copyFile(String(repo + "\\.Temp\\" + comp[0]), String(dest + "\\" + folders[folders.length-1] + "\\" + name), (err) => {
                                             //throws error if could not copy file to destination  
                                         if (err) throw err;
                                         });
 
                                     }
                                 }   
                                 console.log("Completed Command");
                             }
                             
                         }
                     }
                     else
                     {
                         console.log("there was no valid label or valid manifest file")
                     }
                 }
             }
             
         }
         
 
         
 
 
     } catch (err) {
         console.error(err);
     }
    
 
 
 }
 
 
 function getManifest(repo, manif)
 {
     let files = fs.readdirSync(String(repo + "\\.Temp")); 
     try{
         if(manif.slice(-2) == 'rc')
         {
             // return manifest
             return repo + "\\.Temp\\" + manif;
         }
         else if(manif[0] == '|')
         {
             for(let i = 0; i < files.length; i++)
             {
                 if(files[i].slice(-2) == "rc")
                 {
                     // read contents of the file
                     const data = fs.readFileSync(repo + "\\.Temp\\" + files[i], 'UTF-8');
                     let lines = data.split(/\r?\n/);
                     //check is the first line of the manifest
                     let check = lines[0];
                     if(check[0] == '|')
                     {
                         // split out the first lines to check if there's any labels
                         let labels = check.split("|");
                         // for loops to check if the labels the user inputted in the manifest file
                         for(let x = 0; x < labels.length; x++)
                         {
                             if(labels[x] != "" &&  "|"+ labels[x] == manif)
                             {
                                 return repo + "\\.Temp\\" + files[i];
                             }
                         }
                     }
                 }
             }
         }
         else{
             console.log("invalid manifest file or label");
             throw console.error();
         }
     }
     catch (err) {
         console.error(err);
     }
 }
 
 //Test function, no longer needed
 //CheckOut("D:\\343 Project\\Target", "D:\\343 Project\\Tree","|Test")


//==================================================================================================================================
//==================================================================================================================================
//===================================================================================================================End of checkout


//Burgos Joseph
/**
 * Label Feature:
 * allows the user to associate a label with a given manifest file, in order to make it easier
 * for us, the user, to remember and identify a particular project tree snapshot when issuing commands to our vcs
 */
 //given a manifest file location and a label string
 //the character '|' means there is another label

        //Code for HTML
// Labelbtn.addEventListener("click", Test);
// Labelbtn.addEventListener("click", addLabel(targFolder.value, input.value));
// function Test()
// {
//     document.getElementById("Test").innerHTML += "Test from Label Script";
// }
/**
 * addLabel adds a label to a given manifest file
 * string MLoc is the Manifest Location
 * string newLabel the label to be assigned to the manifest
 */
function addLabel(Mloc, newLabel){
    
  let prependFile = require('prepend-file');
  const fs = require('fs');


  let labels;
  //get data from text file
  try {
      // read contents of the file
      let data = fs.readFileSync(Mloc, 'UTF-8');

      // split the contents by new line
      let lines = data.split(/\r?\n/);
      
      //print the array to check if everything seems correct
      //console.log(lines);

      //check is the first line of the manifest
      let check = lines[0];
      //if labels exist, add new label given
      if(check[0] == '|'){

          //add new label--------------replace label here
          lines[0] = lines[0] + "|" + newLabel + "\n";//changed input.value -> newLabel
          
          //replace first line
          fs.writeFile(Mloc, (lines[0]), function (err) {
              if (err) throw err;
          });
          

          //add the rest of lines
          let manifestData = "";
          let i;
          for(i = 1; i < lines.length; i++) {
              //dont insert new line when at the last loop
              if(i == lines.length - 1){
                  lines[i] = lines[i];
                  manifestData += lines[i];  
              }
              else{
                  lines[i] = lines[i] + "\n";
                  manifestData += lines[i];
              }
              
          };
          fs.appendFile(Mloc, manifestData, function (err) {
              if (err) throw err;
          });
      }
      //if there is no labels, then prepend
      else{
          //----------replace label here
          labels = "|" + newLabel + "\n"; //changed input.value -> newLabel
          prependFile(Mloc, labels, function (err) {
              if (err) {
                  // Error
                  console.log("Couldnt add")
              }
          });
      }
      } catch (err) {
          console.error(err);
  }
}



//==================================================================================================================================
//==================================================================================================================================
//======================================================================================================================End of label

function Listfunc(manifest)
{
    const fs = require('fs')
    let data = fs.readFileSync(manifest, 'UTF-8');

    // split the contents by new line
    let lines = data.split(/\r?\n/);
    //Variables to access and mainttain listings    

    console.log("Displaying manifest file!")
    
    //Loop for Manifest to be printed out
    for(let i = 0; i < lines.length; i++)
        {
            console.log(lines[i])
        }
//     
}