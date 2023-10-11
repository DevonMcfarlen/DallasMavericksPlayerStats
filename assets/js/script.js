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
var cardImage = document.querySelector(".player-card");

var finished = false;

function getPlayerImage(player) {
  let toSendUrl = 'professional+headshot+of+' + player.firstname + '+' + player.lastname;
  setBingSettings(toSendUrl);

  var playerImage = "";

  $.ajax(bingSettings).done(function (response) {
    console.log(response);
    finished = true;
    playerImage = response.value[0].contentUrl

  });
  return playerImage
};


function displayPlayerImage (player) {
    var imageDisplay = document.createElement('img');
    var playerImage = getPlayerImage(player)
    setTimeout(() => {imageDisplay.setAttribute('src', playerImage)}, 5000);
    setTimeout(() => {cardImage.append(imageDisplay)}, 5000);
}

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

var cardItems = document.querySelector(".card-items");
var showCardBtn = document.querySelector(".showBtn")

function createCards(){
  var label = document.createElement("label");
  var input = document.createElement("input");

  input.setAttribute("type","checkbox")
  input.setAttribute("class", "flipInput")
  label.appendChild(input)

  var card = document.createElement("div");
  card.setAttribute("class","flip-card");
  label.appendChild(card);

  var first = document.createElement("div");
  first.setAttribute("class","front")
  card.appendChild(first);

  var frontHeader = document.createElement("h2");
  frontHeader.innerHTML = " front stats"
  first.appendChild(frontHeader);
  var frontP = document.createElement("p");
  frontP.innerHTML = " front stats"
  first.appendChild(frontP);

  var second = document.createElement("div");
  second.setAttribute("class","back");
  card.appendChild(second);

  var backHeader = document.createElement("h2");
  backHeader.innerHTML = " back stats"
  second.appendChild(backHeader);
  var backP = document.createElement("p");
  backP.innerHTML = " back stats"
  second.appendChild(backP);

  var li = document.createElement("li")
  li.appendChild(label);
  cardItems.appendChild(li);
  }

showCardBtn.addEventListener("click", function(){
  for(i=0; i < teamPlayers.length; i++){
    createCards()
  }
}) 

cardItems.addEventListener("click", function(event){
  if(event.target.getAttribute('class') === "front"){
    console.log(event.target.getAttribute('class'));
  }
})

/*
showCardBtn.addEventListener("click", function(){
  displayPlayerImage(teamPlayers[i]);
  li.appendChild(cardImage);
  }
)
*/



//getAllTeams();

getTeam();
//setTimeout(() => {getPlayerStats();}, 1000);
//setTimeout(() => {getPlayerStats();}, 5000);
//setTimeout(() => {getPlayerImage(0);}, 1000);
