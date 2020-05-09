// Chloe Culver Hanson Nguyen Steven Centeo
// Completed 3/29/20
// This is the Main js file that is used as a temporary UI
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let reporitoryFolder;
let sourceFold;

let loop = true;



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
                answer = "";


                rl.question("Would you like to add a label to the manifest file?(Y/N)", function(answer)
                {
                    if(answer=="Y" || answer == "y")
                    {
                        rl.question("Enter the name of the label: ", function(label)
                        {
                            let Label = require("./Label")(checkIn.Location, label);
                            console.log("Added label " + label + " to " + checkIn.Location + "\n");
                            let Listings = require("./Listings")(checkIn.Location);
                            Listings.DataListing;
                        });
                    }
                });


                
            });
        });
        
    }

    else if(command == "check-out"){

        //Asks user for input i.e. File loaction and File destination
        rl.question("Please enter the path of the Source Folder: ", function(sourceFolder) {
            rl.question("Please enter the Repository(target) Folder Destination: ", function(targetFolder) {
                rl.question("Please enter the name of the manifest file or the label with \'|\' before it: ", function(manifest) {
                    console.log(`the repository folder ${targetFolder} has been updated`);
                    
                    let checkOut = require('./CheckOut')(sourceFolder,targetFolder, manifest);
                    checkOut.Result;
                    console.log('the repository has been updated!');
                    
                    let Listings = require("./Listings")(checkOut.Location);
                    Listings.DataListing;


                    reporitoryFolder = targetFolder;
                    sourceFold = sourceFolder;
                });
            });
        });
    }
});
