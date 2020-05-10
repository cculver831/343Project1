const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let reporitoryFolder;
let sourceFold;

let loop = true;



//while loop that asks for user input of their commands
rl.question("Welcome to Team Success VCS!! please enter a command (possible commands are:(create-repo, check-in, check-out, merge-in, merge-out)): ",function(command) {

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
                
                let checkIn = require('./CheckIn')(sourceFolder,targetFolder, "check in");
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
        rl.question("Please enter the path of the Source Folder(not the repository): ", function(sourceFolder) {
            rl.question("Please enter the target (Repository) Folder Destination: ", function(targetFolder) {
                rl.question("Please enter the name of the manifest file or the label with \'|\' before it: ", function(manifest) {
                    console.log(`the repository folder ${targetFolder} has been updated`);
                    
                    let checkOut = require('./CheckOut')(targetFolder, sourceFolder, manifest);
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
    else if(command == "merge-in"){
        rl.question("Please enter the path of the Source Folder: ", function(sourceFolder) {
            rl.question("Please enter the Repository(target) Folder Destination: ", function(targetFolder) {
                console.log(`the repository folder ${targetFolder} has been updated`);
                
                let checkIn = require('./CheckIn')(sourceFolder,targetFolder, "merge in");
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
    else if(command == "merge-out")
    {
        rl.question("Please enter the path of the taret (not repository): ", function(targetFolder) {
            rl.question("Please enter the Repository(source) Folder Destination: ", function(sourceFolder) {
                rl.question("Please enter the name of the manifest file or the label with \'|\' before it: ", function(manifest) {
                    
                    //MergeOut('C:\\Users\\steve\\Desktop\\Target','C:\\Users\\steve\\Desktop\\Source', '|FUCK YOU', "commands");
                    let MergeOut = require('./MergeOut')(sourceFolder, targetFolder, manifest, "merge-out, " + targetFolder + ", " + sourceFolder + ", " + manifest);
                    //MergeOut.Result;
                    console.log('the target has been updated!');

                    reporitoryFolder = targetFolder;
                    sourceFold = sourceFolder;
                    answer = "";


                    rl.question("Would you like to add a label to the manifest file?(Y/N)", function(answer)
                    {
                        if(answer=="Y" || answer == "y")
                        {
                            rl.question("Enter the name of the label: ", function(label)
                            {
                                let Label = require("./Label")(MergeOut.loc, label);
                                console.log("Added label " + label + " to " + MergeOut.loc + "\n");
                                let Listings = require("./Listings")(MergeOut.loc);
                                Listings.DataListing;

                            });
                        }

                    });

                });
                
                
            });
        });
    }
});

return 0;
