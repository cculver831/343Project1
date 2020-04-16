//HTML
//CheckInbtn.addEventListener("click", function(){
//  document.getElementById("Test").innerHTML = "Test for ArtifactRunner Script";
//});



const fs = require('fs');
const path = require('path')
//Hanson Nguyen
//completed 03/04/2020



//function to get the content of a file from filepath
function getContent(filePath){
    // try and catch exception if the file path return an error
    try {
      // read the data from the file path argument and return it as the data
      const data = fs.readFileSync(filePath, 'utf8')
      return data
      
    } catch (err) {
      // log the error in the console
      console.error(err)
    }
}

//path.join(path.dirname(__filename) + '\\' + 'MyApp') <-- for getting current filepath

// this CreateArtifact function take in an argument of string for file path. It will handle all the calculation for the PLC
// identification for ArtifactID. After calculation, it will return a string with P----,L--,C----
function CreateArtifact(filePath){
    let result = 0;
    let temp = 0;
    
    //calulation for the file path. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the P part of
    // the artifact
    for (let index = 0; index < filePath.length; index++) {
      if(index % 4 == 0){
        temp += (filePath.charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (filePath.charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (filePath.charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (filePath.charCodeAt(index) * 11);
      }
    }
    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the Path
    if(temp <10){
      result = "P000" + temp + "-";
    }
    else if(temp <100){
      result = "P00" + temp + "-";
    }
    else if( temp < 1000 ){
      result = "P0" + temp+ "-";
    }
    else{
      
      if(temp % 10000 <10){
        result = "P000" + temp % 10000 + "-";
      }
      else if(temp % 10000 <100){
        result = "P00" + temp % 10000 + "-";
      }
      else if(temp % 10000 < 1000 ){
        result = "P0" + temp % 10000+ "-";
      }
      else{
        result = "P" + temp % 10000 + "-";
      }
    }

    //handle calulation for the L/file size of the artifact. The returned values is then modded by 100 to return the 2 most right
    //values for the part of in the returned artifact
    let stats = fs.statSync(filePath);
    let fileSizeInBytes = stats["size"];

    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the File size in byte
    if(fileSizeInBytes < 10){
      result += "L0" + (fileSizeInBytes % 100) + "-";
    }
    else{
      if(fileSizeInBytes % 100 < 10){
        result += "L0" + (fileSizeInBytes % 100) + "-";
      }
      else{
        result += "L" + (fileSizeInBytes % 100) + "-";
      }     
    }
    

    //calulation for the file content. Use the string for file path and calculate each character ascii value with the mulitplication
    //"loop" of 1,7,3,11. The values are all added up afterward and modded by 10000 to get the last 4 values for the C/content part
    //of the artifact
    temp = 0;
    for (let index = 0; index < getContent(filePath).length; index++) {
      if(index % 4 == 0){
        temp += (getContent(filePath).charCodeAt(index) * 1);
      }
      else if(index % 4 == 1){
        temp += (getContent(filePath).charCodeAt(index) * 7);
      }
      else if(index % 4 == 2){
        temp += (getContent(filePath).charCodeAt(index) * 3);
      }
      else if(index % 4 == 3){
        temp += (getContent(filePath).charCodeAt(index) * 11);
      }
    }
    //Else if statements habdle the number values to see if it is less than 4 digits characters to add in extra zeros before the
    //number of the Content
    if(temp <10){
      result += "C000" + temp % 10000 +  ".txt";
    }
    else if(temp <100){
      result += "C00" + temp % 10000 +  ".txt";
    }
    else if(temp <1000){
      result += "C0" + temp % 10000 +  ".txt";
    }
    else{
      if(temp % 10000 < 10){
        result += "C000" + temp % 10000 + ".txt";
      }
      else if(temp % 10000 < 100){
        result += "C00" + temp % 10000 + ".txt";
      }
      else if(temp % 10000 < 1000 ){
        result += "C0" + temp % 10000+ ".txt";
      }
      else{
        result += "C" + temp % 10000 + ".txt";
      }
    }
    console.log(result);
    //return the result as "P####-L##-C####.txt"
    return result;
}
