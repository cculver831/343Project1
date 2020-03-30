//document.getElementById("List").addEventListener('click', Listfunc("Hello"));
//document.getElementById("List").addEventListener('click' , function()
//    {
//    
//    document.getElementById("")
//});

function Listfunc(manifest)
{
    const fs = require('fs')
    const data = fs.readFileSync(manifest, 'UTF-8');

    // split the contents by new line
    var lines = data.split(/\r?\n/);
    //Variables to access and mainttain listings    

    console.log("Displaying manifest file!")
    
    //Loop for Manifest to be printed out
    for(var i = 0; i < lines.length; i++)
        {
            console.log(lines[i])
        }
//   
//    
}

module.exports = function(manifest) {
    return {
        DataListing : Listfunc(manifest)
    };
};