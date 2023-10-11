/*
var bingSettings = {};

function setBingSettings(sentUrl) {
  bingUrl = "https://bing-image-search1.p.rapidapi.com/images/search?q=" + sentUrl;
  bingSettings = {
    async: true,
    crossDomain: true,
    url: bingUrl,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'bc0130d05cmsh21fde0ce708a855p193539jsn96a834534fe7',
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
console.log(playerStorage)
function getPlayerStats() {
  if(playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}))
  {
    console.log("found duplicate player");
    return;
  }
 
  let toSendUrl = "/players/statistics" + "?" + "id=" + teamPlayers[userPlayer].id + "&season=" + userSeason;
  setNBASettings(toSendUrl);

  return $.ajax(nbaSettings).done(function (response) {
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

function getPlayerImage(player) {
  let toSendUrl = 'professional+headshots+of+' + player.firstname + '+' + player.lastname + '+from+espn.com+bio';
  setBingSettings(toSendUrl);

  return $.ajax(bingSettings).done(function (response) {
    console.log(response);
  });
}

function makeCards(i){
  setTimeout(() => {
    var player = teamPlayers[i]
    getPlayerImage(player).then( response => {
      var label = document.createElement("label");
      var input = document.createElement("input");

      label.setAttribute("id", "parent")
      input.setAttribute("type","checkbox");
      input.setAttribute("class", "flipInput");
      input.setAttribute("data-field", i);
      label.appendChild(input);

      var card = document.createElement("div");
      card.setAttribute("class","flip-card");
      label.appendChild(card);

      var first = document.createElement("div");
      first.setAttribute("class","front")
      card.appendChild(first);

      var frontHeader = document.createElement("h2");
      frontHeader.innerHTML = player.firstname + " " + player.lastname;
      first.appendChild(frontHeader);
      var frontP = document.createElement("p");
      //frontP.innerHTML = "Jersey #: " + response.leagues.standard.jersey;
      first.appendChild(frontP);

      var second = document.createElement("div");
      second.setAttribute("class","back");
      card.appendChild(second);

      var backHeader = document.createElement("h2");
      backHeader.innerHTML = " back stats"
      second.appendChild(backHeader);
      var backP = document.createElement("p");
      backP
      second.appendChild(backP);

      var li = document.createElement("li")
      li.appendChild(label);
      cardItems.appendChild(li);

      var cardImage = document.createElement('img');
      cardImage.setAttribute('src', response.value[0].contentUrl);
      cardImage.setAttribute("class", "card-image");
      first.appendChild(cardImage);  
    });
  }, 334*i);
}

showCardBtn.addEventListener("click", function(){
cardItems.innerHTML = "";
playerStorage = [];
for(let i = 0; i < 5; i++){
  makeCards(i);
}
});

cardItems.addEventListener("click", function(event){
  var target = event.target;
  if(target.getAttribute('class') === "flipInput"){
   console.log(target.getAttribute("data-field"))
   userPlayer = target.getAttribute("data-field")
   getPlayerStats().then(response => {
    var stats = playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}).stats
    var showStats = document.getElementById("parent").children[1].children[1].children[1];
    showStats.innerHTML ="Avg assits: " + stats.aAssists + " <br> " + "Avg FGP: " + stats.aFGP + "<br> " + "Avg points: " + stats.aPoints + "<br> " + "Avg total rebounds: " + stats.aTotReb;
   })
  
  }
})

getAllTeams();
getTeam();
*/
