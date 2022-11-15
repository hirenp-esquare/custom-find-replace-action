const core = require('@actions/core');
const github = require('@actions/github');
const glob = require("glob");
const fs = require('fs');


const modifiedCount = 0;
var getDirectories = function (src, callback) {
  glob(src, callback);
};

function findAndReplace(path, FindReplaceParse) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) throw err;
    let newContents = data;
    for (let index = 0; index < FindReplaceParse.length; index++) {
      const item = FindReplaceParse[index];
      newContents = newContents.replace(new RegExp(`${item.find}`, 'gi'), item.replace);
    }
    fs.writeFile(path, newContents, function (err) {
      if (err) throw err;
      ++modifiedCount;
      //console.log('complete');
    });

  });
}

try {

  const globPath = core.getInput('GlobPath');
  const FindReplace = core.getInput('FindReplace');
  const FindReplaceParse = JSON.parse(FindReplace);;

  getDirectories(globPath, function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      //console.log(res);
      for (let index = 0; index < res.length; index++) {
        const path = res[index]
        findAndReplace(path, FindReplaceParse)
      }
    }
  });
   core.setOutput("modifiedFiles", modifiedCount);
} catch (error) {
  core.setFailed(error.message);
}