

//Checkoutbtn.addEventListener("click", CheckOut(targFolder.value, //Destfolder.value, input.value));

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

        
        
        if(manif.slice(-2) == 'rc')
        {
            // read contents of the file
            const data = fs.readFileSync(repo + "\\.Temp\\" + manif, 'UTF-8');
            var lines = data.split(/\r?\n/);

            for(var i = 0; i < lines.length; i++)
            {
                var line = lines[i];
                if(line[0] == "P")
                {
                    var comp = line.split("=");
                    console.log(comp);
                    var folders = comp[1].split("\\");
                    folders.splice(0,1);
                    var name = folders.pop();
                    for(var index = 0; index < folders.length; index++)
                    {
                        if(index != 0)
                        {
                            folders[index] = folders[index-1] + "\\" +  folders[index];
                        }
                    }
                    
                    console.log(folders);
                    for(var a = 0; a < folders.length; a++)
                    {
                        if (!fs.existsSync(dest + "\\" + folders[a])){
                            fs.mkdirSync(dest + "\\" + folders[a]);
                        }
                    }
                    
                    fs.copyFile(String(repo + "\\.Temp\\" + comp[0]), String(dest + "\\" + folders[folders.length-1] + "\\" + name), (err) => {
                        //throws error if could not copy file to destination  
                      if (err) throw err;
                    });

                }
            }   
            console.log("Completed Command");
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
                        var labels = check.split("|");

                        for(var i = 0; i < labels.length; i++)
                        {
                            if(labels[i] != "" &&  "|"+ labels[i] == manif)
                            {
                                for(var i = 0; i < lines.length; i++)
                                {
                                    var line = lines[i];
                                    if(line[0] == "P")
                                    {
                                        var comp = line.split("=");
                                        console.log(comp);
                                        var folders = comp[1].split("\\");
                                        folders.splice(0,1);
                                        var name = folders.pop();
                                        for(var index = 0; index < folders.length; index++)
                                        {
                                            if(index != 0)
                                            {
                                                folders[index] = folders[index-1] + "\\" +  folders[index];
                                            }
                                        }
                                        
                                        console.log(folders);
                                        for(var a = 0; a < folders.length; a++)
                                        {
                                            if (!fs.existsSync(dest + "\\" + folders[a])){
                                                fs.mkdirSync(dest + "\\" + folders[a]);
                                            }
                                        }
                                        
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
            
            // else
            // {
            //     console.log("there was no valid label or valid manifest file")
            // }
        }
        

        


    } catch (err) {
        console.error(err);
    }
   


}

CheckOut('C:\\Users\\Chloe Culver\\Desktop\\343Project1\\Target','C:\\Users\\Chloe Culver\\Desktop\\343Project1\\Tree', "|Test");