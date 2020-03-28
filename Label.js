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
    console.log(lines);
    //check is the first line of the manifest
    var check = lines[0];
    //if labels exist, add new label given
    if(check[0] == '|'){
        //add new label
        lines[0] = lines[0] + "|" + "TestNigga2" + "\n";
        //print the new result
        console.log(lines[0]);
        
        //replace first line
        fs.writeFile('Manifest.txt', (lines[0]), function (err) {
            if (err) throw err;
        });

        var i;
        console.log("Loop tiem");
        //add the rest of lines
        var manifestData = "";
        for(i = 1; i < lines.length; i++) {
            lines[i] = lines[i] + "\n";
            manifestData += lines[i];
        };
        fs.appendFile('Manifest.txt', manifestData, function (err) {
            if (err) throw err;
          });
    }
    //if there is no labels, then prepend
    else{

        labels = "|TestNigga" + "\n";
        prependFile('Manifest.txt', labels, function (err) {
            if (err) {
                // Error
                console.log("Couldnt add")
            }
            // Success
            console.log('The "data to prepend" was prepended to file!');
        });
    }
    } catch (err) {
        console.error(err);
}

