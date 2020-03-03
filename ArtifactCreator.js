const fs = require('fs');
const path = require('path')
//Hanson Nguyen
//completed not yet

var artifactModule = require('./Artifact.js');

var versionName = '.versions.txt'

function updateRepo(folderName){
    if (!fs.existsSync('MyApp\\' + '.' + folderName)) {
        fs.mkdirSync('MyApp\\' + '.' + folderName)
        fs.writeFile('MyApp\\' + '.' + folderName + '\\' + versionName , 'Versions of Artifacts', function (err) {
            if (err) throw err;
            console.log('Version sucessfully updated');
          });  
    }
    
    fs.appendFile('MyApp\\' + '.' + folderName + '\\' + versionName ,"\n " + artifactModule.get().length + " Artifact",function (err){
        if (err) throw err;
    });
    artifactModule.set(20);


    
    
}

console.log("Kill me");
console.log(module);
updateRepo("Repository");