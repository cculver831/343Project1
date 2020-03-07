//gets File Path
function getFilePath(fileName) {
  //put chloes repository file path
  var filepath = "" + fileName
  return filePath
}

function getFileSize(fileInput){
    // files is a FileList object
    var files = fileInput.files;
    return files.size;   
}

function getContent(filePath){
  const fs = require('fs')

  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return data.split('')
    
  } catch (err) {
    console.error(err)
  }
}


let copyFiles = require('./CopyFiles')("D:\\343 Project\\MyApp","D:\\343 Project\\MyApp");
copyFiles.Result;

//getContent("C:\\Users\\josep\\Desktop\\TestFile.txt");