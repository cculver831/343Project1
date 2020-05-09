//create repo ---
//copyFiles('C:\\Users\\steve\\Desktop\\Source','C:\\Users\\steve\\Desktop\\Target'); // project 1 works

//push --- (check in)
//copyFilesToRepository('C:\\Users\\steve\\Desktop\\Source','C:\\Users\\steve\\Desktop\\Target'); //project 2 works
//location = manifestFile('C:\\Users\\steve\\Desktop\\Target') // project 2 works
//create label
//addLabel(location, 'ThisFuckingClassSucks') // project 2 works
//Listfunc(location) // project 2 works

//initial pull -- (check out)
//CheckOut('C:\\Users\\steve\\Desktop\\Target', 'C:', '.man1.rc') //project 2 works
//resultLoc = getManifest('C:\\Users\\steve\\Desktop\\Target', '.man1.rc') //project 2 works
//Listfunc(resultLoc) // project 2 works

const fs = require('fs');
const path = require('path');





// READ FILE STARTS HERE ============================================================================================================
//======================================================================================================================================
//=====================================================================================================================================


//I use the word directory and file path a lot in here so directory or file path = (ex: cd/StevesComputer//Desktop//Project343Folder)
//Takes in the current directory ("__filename" to get current directory), and returns all files in the current directory (except dot files)
//as an array (including folders and files in those folders)

//WILL RETURN NESTED ARRAY [file,[directory,files in the directory],[directory2,files in directory2],file, [directory3,files in directory3], file] 
//ONLY IF THERE ARE FOLDERS IN FOLDERS IN THIS DIRECTORY

// dir = directory as a string, targetFold = name of target folder (only look in this one) as a string " " if no target
//wantPath =  boolean to return the full path of the files too, true to return whole path, false to only return file
//targetFold = the folder that you would want to target in the directory you give [(" ") if you want everything in that directory]
function getFiles (dir, targetFold, wantPath){
	
	const fs = require('fs');
	const path = require('path');

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
			} 
			
			else if (path.isAbsolute(filename) && firstCharInFile != '.'){
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
	const fs = require('fs');
	const path = require('path');

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












//start of copy files==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
function copyFiles(sourceFolder,targetFolder)
{
	const fs = require('fs');
	const path = require('path');
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

		console.log(location)
		console.log(fileInformation)
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
//end of copy file==================================================================================================================================











//begining of create artifact ID==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================


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
//end of get artifact ID==================================================================================================================================










//start of copy files (check in)==================================================================================================================================
//==================================================================================================================================
//=============================================================================================================


//Steven Centeno
//completed 3/26/2020

//this file is means to act like a "push" to the repository

//this is used as a global variable to be used by the copy to reposiory file
var ArraySourceLen;


//this function gets the source tree files and returns them in an array
//the upsource tree variable is the full path of the updated source tree
function getProjectTree(UpSourceTreeDir){

	//read files from the source file (is var so that the variable can be used globally aka outside of the method)
	let readFile = returnAllFilesInDirectory(String(UpSourceTreeDir));
	ArraySourceLen = readFile.length;
	return readFile;
}





//gets everything from the source Folder (from the getProjectTree function) and searches through the files and compares it with 
//the files existing in the repository. If the files already exist in there, it gets overwritten (also takes labels into account)
//additionally, it creates a new manifest file and copies all contents copied and overwritten into the manifest file along with the date/time
//and command used to run the check in
function copyFilesToRepository(UpSourceTreeDir, RepositoryDir){
	const fs = require('fs');
	const path = require('path');
		
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

	const fs = require('fs');
	const path = require('path');

	//reads the latest manifest file in the repository
	let RepLatestMani = getLatestManifestNum(String(RepositoryDir));

	//creates a new manifest file in the repository
	let location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(Number(RepLatestMani) + 1) + ".rc" )
	fs.appendFile(location, "Commit " + ((Number(RepLatestMani)) + 1)  + ".source:\n", function (err) {

		//throws error if could not append file  
		if (err) throw err;
	});

	return location;
		
// document.getElementById("Checkinoutput").innerHTML += "Congratulations! CheckIn Complete";
}

function manifestFile(RepositoryDir)
{

	const fs = require('fs');
	const path = require('path');

	let RepLatestMani = getLatestManifestNum(String(RepositoryDir));

	//creates a new manifest file in the repository
	let location = path.join(String(RepositoryDir) + "\\"  + ".Temp" + "\\" + ".man" + String(RepLatestMani) + ".rc" )
	return location;
}



//==================================================================================================================================
//==================================================================================================================================
//end of copy files==================================================================================================================









//start of check out==================================================================================================================================
//==================================================================================================================================
//=================================================================================================================


//Hanson Nguyen
/**
 * Checkout Feature:
 * allows the user to copy files from the version control into and existing folder
 */
 //paramater passed through will be source repository, destination, and manifest file name or label
 //the character '|' means there is a label

 function CheckOut(repo, dest, manif)
 {

	const fs = require('fs');
	const path = require('path');

	let files = fs.readdirSync(String(repo + "\\.Temp")); 

	try{
		//Create Folder with dir directory if the manifest/label exist and folder doesn't exist
		if (!fs.existsSync(dest)){
				fs.mkdirSync(dest);
		}
		//print the array to check if everything seems correct

		
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

	const fs = require('fs');
	const path = require('path');

	let files = fs.readdirSync(String(repo + "\\.Temp")); 
	try
	{
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


//==================================================================================================================================
//==================================================================================================================================
//end of check out ===================================================================================================================









//start of label==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================


//Burgos Joseph
/**
 * Label Feature:
 * allows the user to associate a label with a given manifest file, in order to make it easier
 * for us, the user, to remember and identify a particular project tree snapshot when issuing commands to our vcs
 */
 //given a manifest file location and a label string
 //the character '|' means there is another label


/**
 * addLabel adds a label to a given manifest file
 * string MLoc is the Manifest Location
 * string newLabel the label to be assigned to the manifest
 */
function addLabel(Mloc, newLabel){
	const fs = require('fs');
	const path = require('path');
		
	let prependFile = require('prepend-file');


	let labels;
	//get data from text file
	try {
		// read contents of the file
		let data = fs.readFileSync(Mloc, 'UTF-8');

		// split the contents by new line
		let lines = data.split(/\r?\n/);
		
		//print the array to check if everything seems correct

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
	} 
	catch (err) {
		console.error(err);
	}
}



//==================================================================================================================================
//==================================================================================================================================
//end of label======================================================================================================================










//start of list function ==================================================================================================================================
//==================================================================================================================================
//======================================================================================================================

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
}
//==================================================================================================================================
//==================================================================================================================================
//end of list function======================================================================================================================










//get the files from the manifest file======================================================================
//======================================================================
//======================================================================


//for the grandma manifest portion of the code to work
function getManifestFiles(userGivenPath){

	const fs = require('fs');
	const path = require('path');

	maniFiles = [];
	
	//goes to the temp directory directly (change the temp into any directory name if you change the name)
	let manifestDir = path.join(userGivenPath + '\\' + '.Temp');

	//if the temp file does not already exist, it will not check for it, this is to avoid creating a new temp file when looking through
	//the source file
	if (!fs.existsSync(manifestDir)){
		return 0;
	}



	//gets an array of everything in the path
	let manifestFilesInDir = fs.readdirSync(manifestDir);

	for(let i in manifestFilesInDir){

		let filename = manifestFilesInDir[i];
		//manifest files names .man<int>.rc accordingly, this lists the latest (biggest) num of mainifest files
		if(filename.length > 4 && path.basename(filename.substring(0,4)) == '.man'){

			maniFiles.push(filename);
		}
	}
	return maniFiles;
	
}


//======================================================================
//======================================================================
//get the files from the manifest file======================================================================










//start of merge Out======================================================================
//======================================================================
//======================================================================

let ArraySourceLenMerge = 0; // will be the length of the manifest array global variable DONT DELETE


//this basically works as a pull that is being done ages after the last pull 
//from the repository, and if there are file collisions (possible because
// its been a long time since the last pull), it will make the user handle these collisions


//repoLoc is the repository
//manifestLoc is a manifest file that is being PULLED from
//branchedRepoLoc is your version of the project that you may have branced out of
//note that all these are directories not the actal file name
function MergeOut(repoLoc, T_BrancedRepoLoc, R_ManifestLoc, command){

	const fs = require('fs');
	const path = require('path');

	//gets the files from the manifest file and saves into an array
	//[[file path,artifact_id, manifest_path],[],[],[],[],[],[],[]] this array is the files of the manifest file
	let SourceFiles = getfilesManifest(repoLoc, R_ManifestLoc);
	
	//files to later be placed into the manifest
	let manifestFiles = [];

	//goes through array of file paths and checks if they are similar to any file in the repository
	//if they are, overwrite them and update the manifest file per file added
	for(let i = 0; i < ArraySourceLenMerge; i++){

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
				manifestFiles.push([filePathSearch, Path_aid]);
			}

			//if the paths are different then get grandma and rename the current wo with _MT and _MR
			// as well as getting the grandma version of it, named _GM
			else{
				//steal professors social security
				let temppath = filePathSearch;

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
				manifestFiles.push([updated_old, fileArtifactIdSearch]);


				//rename target file (old) 
				//next 3 lines update to have "_MR" to old file
				let suffix_new = path.extname(temppath); 
				let updated_new = temppath.substring(0, (temppath.length - suffix_new.length));
				updated_new = updated_new + '_MR' + suffix_new;

				//copy file form R to T because we renamed the old one
				fs.copyFile(manifestIDPath, updated_new, (err) => {
					//throws error if could not copy file to destination  
					if (err) throw err;
				});

				//add the new file path to the manifest array
				manifestFiles.push([updated_new, fileArtifactIdSearch]);

				//get the grandma manifest file
				let maniLoc = repoLoc + "\\" + ".Temp" + "\\" + R_ManifestLoc;
				let grandmaManif = require('./GetGrandma')(repoLoc, maniLoc);

				//now look for the file that has a similar P portion of the artifact ID
				let maniFileGrandma = grandmaManif.Grandma;
				console.log(maniFileGrandma);
				let maniData = fs.readFileSync(maniFileGrandma,'UTF-8');
				let maniLines = maniData.split(/\r?\n/); 
				
				for (let i = 0; i < maniLines.length; i++){

					let currentLine = maniLines[i];

					//if the P portion are similar on both ends, copy it to the manifest file as the grandma
					if(currentLine[0] == "P"){

						let artifactIdArr = currentLine.split("=");
						let artifactIDPortion = artifactIdArr[0];
						let currLineSub = artifactIDPortion.substring(0,5);
						let misMatchManiFileSub = fileArtifactIdSearch.substring(0,5);
						
						if(currLineSub == misMatchManiFileSub){

							let artifactIDPath = repoLoc + "\\" + ".Temp" + "\\" + artifactIDPortion;

							//rename target file (old) 
							//next 3 lines update to have "_MR" to old file
							let suffix_Grandma = path.extname(filePathSearch);
							let updated_Grandma = filePathSearch.substring(0, (filePathSearch.length - suffix_Grandma.length));
							updated_Grandma = updated_Grandma + '_MG' + suffix_Grandma;

							//copy file form R to T because we renamed the old one
							fs.copyFile(artifactIDPath, updated_Grandma, (err) => {
								//throws error if could not copy file to destination  
								if (err) throw err;
							});

							//add the new file path to the manifest array
							manifestFiles.push([updated_Grandma, artifactIDPortion]);
						}
					}
				}
			}
						
		}


		//then if it doesnt exist, copy it over
		else{

			//copy files form R to T
			fs.copyFile(manifestIDPath, filePathSearch, (err) => {
			
				//throws error if could not copy file to destination  
				if (err) throw err;
			});

			//access artifactRunner to use getArtifact
			let artifact = require('./ArtifactRunner')(String(manifestIDPath));
			
			//get the artifact of filePathSearch
			let Path_aid = artifact.getArtifact;

			//add the new file path to the manifest array
			manifestFiles.push([filePathSearch, Path_aid]);
		}
	}

	//create Manifest
	let manifestLocation = createManifestFileMergeOUT(repoLoc);
	
	//copy the files into the manifestwith their artifact ID
	for (let i = 0; i < manifestFiles.length; i++){
			
		//get the path that was aded or updated and get its artifact then add it to the manifest
		let filepath = manifestFiles[i][0];
		let fileAtrifact = manifestFiles[i][1];

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
function createManifestFileMergeOUT(repoLoc){
	const fs = require('fs');
	const path = require('path');

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

			ArraySourceLenMerge += 1;
		}
	}  

	//returns all file paths along with their check sums
	return manifestFilesR;
};



//======================================================================
//======================================================================
//end of merge out======================================================================










//start of get grandma manifest======================================================================
//======================================================================
//======================================================================


//Hanson Nguyen
/**
 * Grandma File Feature:
 * find the most recent manifest file that exist in the same time as the the source folder
 */
 //paramater passed through will be source repository, target folder

function GetGrandma(repo, manifPath)
{
	const path = require('path')
	const fs = require('fs')
	// const targetData = fs.readFileSync(target + "\\.Temp\\" + manif, 'UTF-8');
	
	// Read the repo and target folders
	let ReadFilesSource = require('./ReadFiles')(String(repo));
	let Manif = []
	let month;
	console.log(ReadFilesSource.getManifestFiles)
	// Read the Manifest file that's given in the argument
	let manifestData = fs.readFileSync(manifPath, 'UTF-8');
	// splite the data into an array of lines of give Manifest file
	let manifestLines = manifestData.split(/\r?\n/);
	
	//Go through all the lines of the manifest file to find the time of the created file
	for(let i = 0; i < manifestLines.length; i++)
	{
		// Condition to fine the time when the manifest file was created 
		if(manifestLines[i][0] != 'P' && manifestLines[i][0] != '|' && manifestLines[i][0] != 'C' && manifestLines[i] != '')
		{
			manifestDate = manifestLines[i];
		}
	}
	//Extract the month into number from the 3 letter month to create Date object
	if(manifestDate.substr(4,3) == "Jan")
	{
		month = 1
	}
	else if(manifestDate.substr(4,3) == "Feb")
	{
		month = 2
	}
	else if(manifestDate.substr(4,3) == "Mar")
	{
		month = 3
	}
	else if(manifestDate.substr(4,3) == "Apr")
	{
		month = 4
	}
	else if(manifestDate.substr(4,3) == "May")
	{
		month = 5
	}
	else if(manifestDate.substr(4,3) == "Jun")
	{
		month = 6
	}
	else if(manifestDate.substr(4,3) == "Jul")
	{
		month = 7
	}
	else if(manifestDate.substr(4,3) == "Aug")
	{
		month = 8
	}
	else if(manifestDate.substr(4,3) == "Sep")
	{
		month = 9
	}
	else if(manifestDate.substr(4,3) == "Oct")
	{
		month = 10
	}
	else if(manifestDate.substr(4,3) == "Nov")
	{
		month = 11
	}
	else 
	{
		month = 12
	}

	// Create the date object after extracting all the information from the Manifestdate string
	let manifDate = new Date(manifestDate.substr(11,4),month, manifestDate.substr(8,2), manifestDate.substr(16,2),manifestDate.substr(19,2),  manifestDate.substr(22,2))
	
	// Loop through all the manifest file in the source folder
	for(let i = 0; i < ReadFilesSource.getManifestFiles.length; i++){
		// read the manifest files to look for the time when the manifest files are created on the source folder
		let sourceData = fs.readFileSync(String(repo) + "\\.Temp\\" + ReadFilesSource.getManifestFiles[i], 'UTF-8');
		//Split up the source file into an array of lines to look for the date
		let sourceLines = sourceData.split(/\r?\n/);
		let sourceDate,sourceMonth

		// Loop through all the lines of the source manifest file to compare with the given manifest
		for(let i2 = 0; i2  < sourceLines.length; i2++)
		{
			// Condition to find the time when the manifest file of the source repository was created
			if(sourceLines[i2][0] != 'P' && sourceLines[i2][0] != '|' && sourceLines[i2][0] != 'C' && sourceLines[i2] != '')
			{
				sourceDate = sourceLines[i2];
			}
		}
		// Condition to go through the 3 word object extracted from source date and convert it to number
		if(sourceDate.substr(4,3) == "Jan")
		{
			sourceMonth = 1
		}
		else if(sourceDate.substr(4,3) == "Feb")
		{
			sourceMonth = 2
		}
		else if(sourceDate.substr(4,3) == "Mar")
		{
			sourceMonth = 3
		}
		else if(sourceDate.substr(4,3) == "Apr")
		{
			sourceMonth = 4
		}
		else if(sourceDate.substr(4,3) == "May")
		{
			sourceMonth = 5
		}
		else if(sourceDate.substr(4,3) == "Jun")
		{
			sourceMonth = 6
		}
		else if(sourceDate.substr(4,3) == "Jul")
		{
			sourceMonth = 7
		}
		else if(sourceDate.substr(4,3) == "Aug")
		{
			sourceMonth = 8
		}
		else if(sourceDate.substr(4,3) == "Sep")
		{
			sourceMonth = 9
		}
		else if(sourceDate.substr(4,3) == "Oct")
		{
			sourceMonth = 10
		}
		else if(sourceDate.substr(4,3) == "Nov")
		{
			sourceMonth = 11
		}
		else 
		{
			sourceMonth = 12
		}
		// extract the information from sourceDate to create the date object
		let sourDate = new Date(sourceDate.substr(11,4),sourceMonth, sourceDate.substr(8,2), sourceDate.substr(16,2),sourceDate.substr(19,2), sourceDate.substr(22,2))
		console.log(sourDate)
		//Push the source file into Manif array if the source file is at a time before the manifest file
		if(sourDate < manifDate)
		{
			//Push the path into the Manif array
			Manif.push(String(repo) + "\\.Temp\\" + ReadFilesSource.getManifestFiles[i])
		}
	}

	// return the path of the grandma file that's at the top most recent location of the tree
	return String(Manif[Manif.length -1])
}