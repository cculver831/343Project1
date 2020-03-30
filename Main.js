const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


<<<<<<< Updated upstream
//Asks user for input i.e. File loaction and File destination
rl.question("Welcome to Team Success VCS!! Please enter the path of the Source Folder: ", function(sourceFolder) {
    rl.question("Please enter the Target Folder Destination: ", function(targetFolder) {
        console.log(`${sourceFolder}, contents are being repo'd to Target Destination: ${targetFolder}`);
        
        let copyFiles = require('./CopyFiles')(sourceFolder,targetFolder);
        copyFiles.Result;
        console.log("Congratulations! You're repo was a success. Check your Target Folder to see what's happened");  
    
    });
=======

//while loop that asks for user input of their commands
rl.question("Welcome to Team Success VCS!! please enter a command (possible commands are:(create-repo, check-in, check-out)): ",function(command) {

    //if the command is create repo, create the repository
    if(command == "create-repo"){

        //Asks user for input i.e. File loaction and File destination
        rl.question("Please enter the path of the Source Folder: ", function(sourceFolder) {
            rl.question("Please enter the Target Folder Destination: ", function(targetFolder) {
                console.log(`${sourceFolder}, contents are being repo'd to Target Destination: ${targetFolder}`);
                
                let copyFiles = require('./CopyFiles')(sourceFolder,targetFolder);
                copyFiles.Result;
                console.log("Congratulations! You're repo was a success. Check your Target Folder to see what's happened");  
            
                reporitoryFolder = targetFolder;
                sourceFold = sourceFolder;
            });
        });
    }

    //the check in command that runs when the user calls the check in
    else if(command == "check-in"){

        //Asks user for input i.e. File loaction and File destination
        rl.question("Please enter the path of the Source Folder: ", function(sourceFolder) {
            rl.question("Please enter the Repository(target) Folder Destination: ", function(targetFolder) {
                console.log(`the repository folder ${targetFolder} has been updated`);
                
                let checkIn = require('./CheckIn')(sourceFolder,targetFolder);
                checkIn.Result;
                console.log('the repository has been updated!');

                reporitoryFolder = targetFolder;
                sourceFold = sourceFolder;
            });
        });
    }

    else if(command == "check-out"){

        //Asks user for input i.e. File loaction and File destination
        rl.question("Please enter the path of the Source Folder: ", function(sourceFolder) {
            rl.question("Please enter the Repository(target) Folder Destination: ", function(targetFolder) {
                
                
                let checkOut = require('./CheckOut')(sourceFolder,targetFolder);
                checkOut.Result;
                console.log('the repository has been updated!');

                reporitoryFolder = targetFolder;
                sourceFold = sourceFolder;
            });
        });
    }
>>>>>>> Stashed changes
});
