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

module.exports = function(repo, manif) {
    return {
        Grandma : GetGrandma(repo,manif)
    };
};


//console.log(GetGrandma("D:\\343 Project\\Target", "D:\\343 Project\\Target\\.Temp\\.man3.rc"))