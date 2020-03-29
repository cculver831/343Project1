//Burgos Joseph
/**
 * Label Feature:
 * allows the user to associate a label with a given manifest file, in order to make it easier
 * for us, the user, to remember and identify a particular project tree snapshot when issuing commands to our vcs
 */
 //given a manifest file location and a label string
 //the character '|' means there is another label


 var prependFile = require('prepend-file');
 const fs = require('fs');


 var labels;
//get data from text file
try {
    // read contents of the file
    const data = fs.readFileSync('Manifest.txt', 'UTF-8');

     // split the contents by new line
    var lines = data.split(/\r?\n/);
    
    //print the array to check if everything seems correct
    //console.log(lines);

    //check is the first line of the manifest
    var check = lines[0];
    //if labels exist, add new label given
    if(check[0] == '|'){
        //add new label--------------replace label here
        lines[0] = lines[0] + "|" + "TestNigga2" + "\n";
        
        //replace first line
        fs.writeFile('Manifest.txt', (lines[0]), function (err) {
            if (err) throw err;
        });
        

        //add the rest of lines
        var manifestData = "";
        var i;
        for(i = 1; i < lines.length; i++) {
            //dont insert new line when at the last loop
            if(i == lines.length - 1){
                lines[i] = lines[i];
                manifestData += lines[i];  
            }
            else{
                lines[i] = lines[i] + "\n";
                manifestData += lines[i];
            }
            
        };
        fs.appendFile('Manifest.txt', manifestData, function (err) {
            if (err) throw err;
          });
    }
    //if there is no labels, then prepend
    else{
        //----------replace label here
        labels = "|" + "TestNigga" + "\n";
        prependFile('Manifest.txt', labels, function (err) {
            if (err) {
                // Error
                console.log("Couldnt add")
            }
        });
    }
    } catch (err) {
        console.error(err);
}

