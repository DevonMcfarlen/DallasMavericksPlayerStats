
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

var allTeams = [];
var teamPlayers = [];
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

function getAllTeams() {
  let toSendUrl = "/teams";
  setNBASettings(toSendUrl);

  $.ajax(nbaSettings).done(function (response) {
    console.log(response);
    for(var i = 0; i < response.response.length; i++)
      allTeams.unshift({teamName: response.response.name, teamId: response.response.id});
  });
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

var cardItems = document.querySelector(".card-items");
var showCardBtn = document.querySelector(".showBtn");
var cardImage = document.querySelector(".player-card");

var finished = false;

async function getPlayerImage(player) {
    let toSendUrl = 'professional+headshot+of+' + teamPlayers[player].firstname + '+' + teamPlayers[player].lastname;
    setBingSettings(toSendUrl);

    var playerImage = "";

    $.ajax(bingSettings).done(function (response) {
    console.log(response);
    if (response.value && response.value.length > 0) {
      return response.value[0].contentUrl
    } else {
      console.log("No image found for player");
    }
    
    //finished = true;
    //playerImage = response.value[0].contentUrl

  });
}
    //return playerImage;

async function displayPlayerImage(player) {
  try {
    var playerImage = await getPlayerImage(player);
    if (playerImage) {
    var imageDisplay = document.createElement('img');
    imageDisplay.setAttribute('src', playerImage);
    cardImage.appendChild(imageDisplay);
  }
}   catch (error) {
      console.log(error);
}
}


showCardBtn.addEventListener("click", function(){
  for(i=0; i < teamPlayers.length; i++){
  var li = document.createElement("li");
  li.classList.add("statsList")
  cardItems.appendChild(li);
  li.innerHTML = "stats go here (li)"
  displayPlayerImage();
  // displayPlayerImage(teamPlayers[i]);
  // li.appendChild(cardImage);
  }
})



getAllTeams();

getTeam();
//setTimeout(() => {getPlayerStats();}, 1000);
//setTimeout(() => {getPlayerStats();}, 5000);
//setTimeout(() => {getPlayerImage(0);}, 1000);


/*
  for var (i = 0; i < teamPlayers.length; i++) {

  }
    var imageUrl = response.value[0].contentUrl;

    var img = document.createElement("img");
    img.src = imageUrl;

    var cardItems = document.querySelectorAll(".card-items li");
    if (cardItems[index]) {
      cardItems[index].appendChild(img);
    } else {
      console.log('No image found for player ' + teamPlayers[player].firstname + '' + teamPlayers[player].lastname);
    }
  }
});
*/