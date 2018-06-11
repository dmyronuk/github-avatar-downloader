var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  request(url, function(err, res, body) {
    cb(err, res, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, res, body){
  console.log("Errors:", err);
  console.log("Result:", body);
});