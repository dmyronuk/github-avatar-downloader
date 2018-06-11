var request = require('request');
var tokens = require("./tokens.js");


console.log('Welcome to the GitHub Avatar Downloader!');
console.log(tokens.GITHUB_TOKEN)

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "dmyronuk",
      "Authorization": "token " + tokens.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, res, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, res, body){
  console.log("Errors:", err);
  console.log("Result:", body);
});