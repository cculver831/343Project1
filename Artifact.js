//Hanson Nguyen
//completed not yet

let artifactArray = [10];
exports.artifactArray = artifactArray; 
exports.set = function(value) {
    artifactArray.push(value);
};
exports.get = function() {
    return artifactArray;
};