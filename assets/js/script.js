var bingSettings = {};

function setBingSettings(sentUrl) {
  var bingUrl = "https://bing-image-search1.p.rapidapi.com/images/search?q=" + sentUrl;
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

var teamPlayers = [];
var userSeason = 2022; //this is a temporary value, it will be changed from the user input
var nbaSettings = {};

function setNBASettings(sentUrl) {
  var nbaUrl = "https://api-nba-v1.p.rapidapi.com" + sentUrl;
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
  let toSendUrl = "/players/" + "?" + "team=8&season=" + userSeason;
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
function getPlayerStats(userPlayer) {
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
      
    playerStats.aPoints = Math.round((((tPoints/pGLength)) + Number.EPSILON) * 100) / 100;
    playerStats.aAssists = Math.round((((tAssists/pGLength)) + Number.EPSILON) * 100) / 100;
    playerStats.aTotReb = Math.round((((tTotReb/pGLength)) + Number.EPSILON) * 100) / 100;
    playerStats.aFGP = Math.round((((tTotReb/pGLength)) + Number.EPSILON) * 100) / 100;
  
    playerStorage.unshift({id: response.parameters.id, stats: playerStats});
  });
}

var cardItems = document.querySelector(".card-items");
var showCardBtn = document.querySelector(".showBtn");

function getPlayerImage(player) {
  let toSendUrl = 'professional+headshot+of+' + player.firstname + '+' + player.lastname + '+from+espn.com+bio';
  setBingSettings(toSendUrl);

  return $.ajax(bingSettings).done(function (response) {
    console.log(response);
  });
}

var cardItems = document.querySelector(".card-items");
var showCardBtn = document.querySelector(".showBtn")

function makeCards(i){
  setTimeout(() => {
    var player = teamPlayers[i];
    getPlayerImage(player).then( response => {
      var label = document.createElement("label");
      var input = document.createElement("input");

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
        //backP.innerHTML
      second.appendChild(backP);

      var li = document.createElement("li")
      li.appendChild(label);
      cardItems.appendChild(li);

      var cardImage = document.createElement('img');
      cardImage.setAttribute('src', response.value[0].contentUrl);
      cardImage.setAttribute('class', 'card-image');
      first.appendChild(cardImage);  
      });
    }, 400*i);
  }
var 
$form = $('.ui.compact.selection.dropdown')
  userSeason = $form.form('get value', 'value')
;

showCardBtn.addEventListener("click", function(event){
  console.log(userSeason);
  cardItems.innerHTML = "";
  playerStorage = [];
  for(let i = 0; i < 1; i++){
    makeCards(i);
  }
});

cardItems.addEventListener("click", function(event){
  var target = event.target;
  if(target.getAttribute('class') === "flipInput"){
    var userPlayer = target.getAttribute('data-field');
    getPlayerStats(userPlayer).then( response => {
      var backOfCardText = target.parentElement.children[1].children[1].children[1];
      console.log(playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}).stats);
      var stats = playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}).stats;
      backOfCardText.innerHTML = "Average Points: " + stats.aPoints + "<br>" +
                                "Average Assists: " + stats.aAssists + "<br>" +
                                "Average Rebounds: " + stats.aTotReb + "<br>" +
                                "Average FGP: " + stats.aFGP + "<br>";
    });
  }
})

getTeam();