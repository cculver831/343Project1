

//Hanson Nguyen
/**
 * Checkout Feature:
 * allows the user to copy files from the version control into and existing folder
 */
 //paramater passed through will be source repository, destination, and manifest file name or label
 //the character '|' means there is a label

function CheckOut(repo, dest, manif)
{
    const path = require('path')
    const fs = require('fs')
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
            const data = fs.readFileSync(repo + "\\.Temp\\" + manif, 'UTF-8');
            var lines = data.split(/\r?\n/);

            // Loops through the data in the confirmed manifest file and carry logic accordingly
            for(var i = 0; i < lines.length; i++)
            {
                var line = lines[i];
                // Check if the first letter of the line is P for the file 
                if(line[0] == "P")
                {
                    var comp = line.split("=");
                    console.log(comp);
                    var folders = comp[1].split("\\");
                    folders.splice(0,1);
                    var name = folders.pop();
                    // Loop through each components folder of the path and ger rid of
                    for(var index = 0; index < folders.length; index++)
                    {
                        // Add the directory folders with the last folders, ending result will be the full path of the folder
                        if(index != 0)
                        {
                            folders[index] = folders[index-1] + "\\" +  folders[index];
                        }
                    }

                    console.log(folders);
                    // Make the folder indiviually with the given path from the beginning to end
                    for(var a = 0; a < folders.length; a++)
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
            for(var i = 0; i < files.length; i++)
            {
                if(files[i].slice(-2) == "rc")
                {
                    // read contents of the file
                    const data = fs.readFileSync(repo + "\\.Temp\\" + files[i], 'UTF-8');
                    var lines = data.split(/\r?\n/);
                    //check is the first line of the manifest
                    var check = lines[0];
                    if(check[0] == '|')
                    {
                        // split out the first lines to check if there's any labels
                        var labels = check.split("|");
                        // for loops to check if the labels the user inputted in the manifest file
                        for(var i = 0; i < labels.length; i++)
                        {
                            if(labels[i] != "" &&  "|"+ labels[i] == manif)
                            {

                                // go through each lines to check for artifact name and file data
                                for(var i = 0; i < lines.length; i++)
                                {
                                    var line = lines[i];
                                    // Check if the first letter of the line is P for the file 
                                    if(line[0] == "P")
                                    {
                                        var comp = line.split("=");
                                        console.log(comp);
                                        var folders = comp[1].split("\\");
                                        folders.splice(0,1);
                                        var name = folders.pop();
                                        // Loop through each components folder of the path and ger rid of
                                        for(var index = 0; index < folders.length; index++)
                                        {
                                            // Add the directory folders with the last folders, ending result will be the full path of the folder
                                            if(index != 0)
                                            {
                                                folders[index] = folders[index-1] + "\\" +  folders[index];
                                            }
                                        }
                                        
                                        console.log(folders);
                                        // Make the folder indiviually with the given path from the beginning to end
                                        for(var a = 0; a < folders.length; a++)
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
    try{
        if(manif.slice(-2) == 'rc')
        {
            // return manifest
            return repo + "\\.Temp\\" + manif;
        }
        else if(manif[0] == '|')
        {
            for(var i = 0; i < files.length; i++)
            {
                if(files[i].slice(-2) == "rc")
                {
                    // read contents of the file
                    const data = fs.readFileSync(repo + "\\.Temp\\" + files[i], 'UTF-8');
                    var lines = data.split(/\r?\n/);
                    //check is the first line of the manifest
                    var check = lines[0];
                    if(check[0] == '|')
                    {
                        // split out the first lines to check if there's any labels
                        var labels = check.split("|");
                        // for loops to check if the labels the user inputted in the manifest file
                        for(var i = 0; i < labels.length; i++)
                        {
                            if(labels[i] != "" &&  "|"+ labels[i] == manif)
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

module.exports = function(repo, dest, manif) {
    return {
        Result : CheckOut(repo, dest, manif),
        Location : getManifest(repo,manif)
    };
};

CheckOut("D:\\343 Project\\Target", "D:\\343 Project\\Tree","|Test")