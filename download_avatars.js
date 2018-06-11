var request = require('request');
var fs = require("fs");
var dotenv = require("dotenv").config();

console.log(process.env.GITHUB_TOKEN)

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "dmyronuk",
      "Authorization": "token " + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if(err){
      console.log("Errors:", err);
    }

    var contributorObjs = JSON.parse(body);
    cb(contributorObjs);
  });
}

function downloadImageByURL(url, filePath){

  request.get(url)
  .on("error", function(error){
    console.log(error);
  })
  .on("response", function(response){
    console.log("Response Status Code:", response.statusCode);
    console.log("Response Headers:", response.headers['content-type']);
  })
  .pipe(fs.createWriteStream(`./${filePath}`))
};

var repoOwnerArg = process.argv[2];
var repoNameArg = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

if(repoOwnerArg && repoNameArg){
  getRepoContributors(repoOwnerArg, repoNameArg, function(obj){
    obj.forEach(function(elem){
      var curUrl = elem.avatar_url;
      var curFilePath = `avatars/${elem.login}.jpg`;
      downloadImageByURL(curUrl, curFilePath);
    })
  });
}else{
  console.log("Error: repo owner and repo name are required arguments");
};

