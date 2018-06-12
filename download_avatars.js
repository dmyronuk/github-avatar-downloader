var request = require('request');
var fs = require("fs");
var dotenv = require("dotenv").config();

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
    if(contributorObjs.message === "Bad credentials"){
      console.log("Bad credentials");
      return;
    }else if(contributorObjs.message === "Not Found"){
      console.log("Repository Not Found");
      return;
    }

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

function checkErrors(){
  if( ! fs.existsSync("./avatars")){
    throw "Error: Directory ./avatars must exist in the root folder";
  }else if( ! fs.existsSync("./.env")){
    throw "Error: Config file .env must exist in the root folder";
  }else if( ! process.env.GITHUB_TOKEN){
    throw "Error: .env  does not contain GITHUB_TOKEN";
  }else if(process.argv.length !== 4){
    throw "Error: script takes 2 arguments repo_owner repo_name";
  }
};

var repoOwnerArg = process.argv[2];
var repoNameArg = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');
try{
  checkErrors();
}catch(e){
  console.log(e);
  return;
}

getRepoContributors(repoOwnerArg, repoNameArg, function(obj){
  obj.forEach(function(elem){
    var curUrl = elem.avatar_url;
    var curFilePath = `avatars/${elem.login}.jpg`;
    downloadImageByURL(curUrl, curFilePath);
  })
});
