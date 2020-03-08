const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//Asks user for input i.e. File loaction and File destination
rl.question("Welcome to Team Success VCS!! Please enter the path of the Source Folder: ", function(sourceFolder) {
    rl.question("Please enter the Target Folder Destination: ", function(targetFolder) {
        console.log(`${sourceFolder}, contents are being repo'd to Target Destination: ${targetFolder}`);
        
        let copyFiles = require('./CopyFiles')(sourceFolder,targetFolder);
        copyFiles.Result;
        console.log("Congratulations! You're repo was a success. Check your Target Folder to see what's happened");  
    
    });
});
