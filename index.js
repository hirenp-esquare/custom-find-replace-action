const core = require('@actions/core');
const github = require('@actions/github');
const glob = require("glob");
const fs = require('fs');


var modifiedCount = 0;
var totalFiles = 0;
var getDirectories = function (src, callback) {
  glob(src, callback);
};


function findAndReplace(path, FindReplaceParse) {
  //return new Promise(function (resolve, reject) {
    fs.readFileSync(path, 'utf8', function (err, data) {
      if (err) {
        //resolve(modifiedCount);
        throw err;
      }
      let newContents = data;
      for (let index = 0; index < FindReplaceParse.length; index++) {
        const item = FindReplaceParse[index];
        newContents = newContents.replace(new RegExp(`${item.find}`, 'gi'), item.replace);
      }
      if (newContents =! data) {
        fs.writeFileSync(path, newContents, function (err) {
          if (err) {
            //resolve(modifiedCount);
            throw err;
          }
          ++modifiedCount
            //resolve();

        });
      }

    });

  //});
}

try {

  const globPath = core.getInput('GlobPath');
  const FindReplace = core.getInput('FindReplace');
  const FindReplaceParse = JSON.parse(FindReplace);;

  getDirectories(globPath, function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(res);
      if (res.length > 0) {
        for (let index = 0; index < res.length; index++) {
          const path = res[index]
          var stats = fs.statSync(path);
          if (stats.isFile()) {
            ++totalFiles;
            /*findAndReplace(path, FindReplaceParse).then(function (modifiedCountRes) {
              core.setOutput("modifiedFiles", modifiedCountRes);
            })*/
            findAndReplace(path, FindReplaceParse);
            core.setOutput("modifiedFiles", modifiedCountRes);
          }
        }
      } else {
        core.setOutput("modifiedFiles", modifiedCountRes);
      }
    }
  });

} catch (error) {
  core.setFailed(error.message);
}