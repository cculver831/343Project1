//Hanson Nguyen
/**
 * Grandma File Feature:
 * find the most recent manifest file that exist in the same time as the the source folder
 */
 //paramater passed through will be source repository, target folder

function GetGrandma(repo, target)
{
    const path = require('path')
    const fs = require('fs')
    // const targetData = fs.readFileSync(target + "\\.Temp\\" + manif, 'UTF-8');
    
    // Read the repo and target folders
    let ReadFilesSource = require('./ReadFiles')(String(repo));
    let ReadFilesTarget = require('./ReadFiles')(String(target));
    let Manif = []
    console.log(ReadFilesSource.getManifestFiles)
    console.log(ReadFilesTarget.getManifestFiles)
    // Loop through all the manifest file in the source folder
    for(let i = 0; i < ReadFilesSource.getManifestFiles.length; i++){
        // read the manifest files to look for the time when the manifest files are created on the source folder
        var sourceData = fs.readFileSync(String(repo) + "\\.Temp\\" + ReadFilesSource.getManifestFiles[i], 'UTF-8');
        // loop through all the manifest file in the target folder
        for (let tarI = 0; tarI < ReadFilesTarget.getManifestFiles.length; tarI++)
        {
            //read the manifest files to look for the time when the manifest files are created on the target folder
             targetData = fs.readFileSync(String(target) + "\\.Temp\\" + ReadFilesTarget.getManifestFiles[tarI], 'UTF-8');
            //Split up the source file into an array of lines to look for the date
            let sourceLines = sourceData.split(/\r?\n/);
            //Split up the target file into an array of lines to look for the date
            let targetLines = targetData.split(/\r?\n/);

            console.log(sourceLines)
            console.log(targetLines)
            // Go through all the lines in the manifest file in the source folder to look for the date
            for (let i2 = 0; i2 < sourceLines.length; i2++)
            {
                // Condition for the manifest file in the source folder, the condition is going from the bottom of the tree to the top of the tree
                // to the find the most recent file
                if(sourceLines[i2][0] != 'P' && sourceLines[i2][0] != '|' && sourceLines[i2][0] != 'C' && sourceLines[i2] != '')
                {
                    // Go through all the lines in the manifest file in the target folder to look for the date
                    for(let i3 = 0; i3 < targetLines.length; i3++)
                    {
                        // Condition for the manifest file in the target folder, the condition is going from the bottom of the tree to the top of 
                        // the tree to the find the most recent file
                        if(targetLines[i3][0] != 'P' && targetLines[i3][0] != '|' && targetLines[i3][0] != 'C' && targetLines[i3] != '')
                        {
                            //condition comparision and get rid prevent access string from being compared
                            if(targetLines[i3] == sourceLines[i2])
                            {
                                //Push into the manif array that have similar files from left to right
                                Manif.push(String(target) + "\\.Temp\\" + ReadFilesTarget.getManifestFiles[tarI])
                            }
                            
                        }
                    }
                }
            }
        }
        
    }
    // return the path of the grandma file that's at the top most recent location of the tree
    return String(Manif[Manif.length -1])
}

module.exports = function(repo, target) {
    return {
        Grandma : GetGrandma(repo,target)
    };
};


console.log(GetGrandma("D:\\343 Project\\Target", "D:\\343 Project\\DES copy"))