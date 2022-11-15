const core = require('@actions/core');
const github = require('@actions/github');
const glob = require("glob");
const fs = require('fs');


var getDirectories = function (src, callback) {
  glob(src, callback);
};

function findAndReplace(path) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) throw err;
    //Do your processing, MD5, send a satellite to the moon, etc.
    let newContents = data.replace(/DEV/ig, 'World');
    fs.writeFile(path, newContents, function (err) {
      if (err) throw err;
      console.log('complete');
    });
  });
}

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  getDirectories('/**/*', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      //res.push("data");
      console.log(res);

      for (let index = 0; index < res.length; index++) {
        const path = res[index]
        findAndReplace(path)
      }
    }
  });
  //const time = (new Date()).toTimeString();
  //core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}