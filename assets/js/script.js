var bingSettings = {};

function setBingSettings(sentUrl) {
  bingUrl = "https://bing-image-search1.p.rapidapi.com/images/search?q=" + sentUrl;
  bingSettings = {
    async: true,
    crossDomain: true,
    url: bingUrl,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8',
      'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
    },
  };
}

teamPlayers = [];
var userTeam = 8; //this is a temporary value, it will be changed from user input
var userSeason = 2022; //this is a temporary value, it will be changed from the user input
var userPlayer = 3; //this is a temporary value, it will be changed from user input
var nbaUrl = "https://api-nba-v1.p.rapidapi.com";
var nbaSettings = {};

function setNBASettings(sentUrl) {
  nbaUrl = "https://api-nba-v1.p.rapidapi.com" + sentUrl;
  nbaSettings = {
    "url": nbaUrl,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "x-rapidapi-key": "09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8",
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
    },
  };
}

function getTeam() {
  let toSendUrl = "/players/" + "?" + "team=" + userTeam + "&season=" + userSeason;
  setNBASettings(toSendUrl);

  $.ajax(nbaSettings).done(function (response) {
    console.log(response);
    teamPlayers = response.response;
  });
}

var playerStats = {
  aPoints: 0,
  aAssists: 0,
  aTotReb: 0,
  aFGP: 0.0,
};

var playerStorage = [];

function getPlayerStats() {
  if(playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}))
  {
    console.log("found duplicate player");
    return;
  }
    
  let toSendUrl = "/players/statistics" + "?" + "id=" + teamPlayers[userPlayer].id + "&season=" + userSeason;
  setNBASettings(toSendUrl);

  $.ajax(nbaSettings).done(function (response) {
    var playerGames = response.response;
    var pGLength = playerGames.length;
    var tPoints = 0;
    var tAssists = 0;
    var tTotReb = 0;
    var tFGP = 0.0;

    for(var i = 0; i < pGLength; i++){
      tPoints += playerGames[i].points;
      tAssists += playerGames[i].assists;
      tTotReb += playerGames[i].totReb
      tFGP += parseFloat(playerGames[i].fgp);
    }
    
    playerStats.aPoints = tPoints/pGLength;
    playerStats.aAssists = tAssists/pGLength;
    playerStats.aTotReb = tTotReb/pGLength;
    playerStats.aFGP = tFGP/pGLength;

    playerStorage.unshift({id: response.parameters.id, stats: playerStats});

    console.log(response);
    console.log(playerStats);
    console.log(playerStorage);
  });
}

function getPlayerImage(player) {
  let toSendUrl = 'professional+headshot+of+' + teamPlayers[player].firstname + '+' + teamPlayers[player].lastname;
  setBingSettings(toSendUrl);

  $.ajax(bingSettings).done(function (response) {
    console.log(response);
  });
}

getTeam();
setTimeout(() => {getPlayerStats();}, 1000);
setTimeout(() => {getPlayerStats();}, 5000);
setTimeout(() => {getPlayerImage(0);}, 1000);