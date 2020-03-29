
function CheckOut( repo, dest, manif)
{
    const path = require('path')
    const fs = require('fs')
    var dir =  path.join(dest + '\\' +'.Temp');

    let ReadFiles = require('./ReadFiles')(String(sourceFolder));

    try{
        // read contents of the file
        const data = fs.readFileSync(manif, 'UTF-8');
        
        var lines = data.split(/\r?\n/);
        
        //print the array to check if everything seems correct
        //console.log(lines);

        //check is the first line of the manifest
        var check = lines[0];
        
        if(check[0] == '|')
        {
            var label = "";
            for(var i = 1; i < check.length; i++)
            {
                if(check[i] == '|')
                {
                    break;
                }
                label += check[i];
            }
            console.log(label);
        }
        
        //Create Folder with dir directory if the manifest/label exist and folder doesn't exist
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        



        let ReadFiles = require('./ReadFiles')(String(repo));

        


    } catch (err) {
        console.error(err);
    }
   


}