const fs = require('fs');
const path = require('path');
//Steven Centeno
//completed 2/28/2020    

//This file will:
//change files in the repo (update the repo) by adding new files (or changed files) from the source project tree

//each check in is a different version of the project tree
//create for each new project tree a manifest file representing every single file existing in the project tree (copied to the repo or not)
//with the command line and the date and time stamp

//will search through the manifest files (versions) in the project tree possibly using labels
//users folder conatining a version of the project tree (the argument for the check in function) should have also been the argument for the
//check out function (or command to be exact), (it could have also been the original create repo function call) and it will always remain as 
//the same folder/argument

//most code already developed
//new issues are:

//1. If a project file has the same computed “CPL” artifact ID as an artifact in the repo, then we can
//  presume that the project-tree artifact is the same file in both places. So, you do not need to
//  copy this project-tree artifact and overwrite the existing identical artifact copy in the repo –
//  but if that seems easier then you can do such an overwrite spending the extra copy time.

//2. Also, you will create a "check-in" manifest file for this command. It will include the command
//  and its arguments as well as the usual manifest information (same as for a "create-repo"
//  command.) Note, if your project #1 manifest didn't include the "create-repo" command and
//  arguments that was used to create it, please upgrade so that that manifest includes these.

//3. Regardless of whether a project-tree file has been changed (ie, it's a new artifact ID) or not (ie,
//  it's a duplicate artifact ID of an artifact in the repo), the file-name and its artifact ID must be
//  recorded in the new manifest file for this check-in (with the check-in command line
//  arguments and the date-time stamp, of course).
