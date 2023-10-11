var bingSettings = {};

function setBingSettings(sentUrl) {
  var bingUrl = "https://bing-image-search1.p.rapidapi.com/images/search?q=" + sentUrl;
  bingSettings = {
    async: true,
    crossDomain: true,
    url: bingUrl,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '23621a63e4msha9fc92986a51b9fp1bfe54jsn18d7163659ca',
      'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
    },
  };
}

var teamPlayers = [];
var userSeason = 0;
var $form = $('.ui.selection.dropdown')
  .dropdown()
  selection = $form.form('get value')
;

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
  let toSendUrl = "/players/?team=8&season=" + userSeason;
  setNBASettings(toSendUrl);

  return $.ajax(nbaSettings).done(function (response) {
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
 
  let toSendUrl = "/players/statistics?id=" + teamPlayers[userPlayer].id + "&season=" + userSeason;
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

  return $.ajax(bingSettings).done(function (response) {});
}

var cardItems = document.querySelector(".card-items");
var showCardBtn = document.querySelector(".showBtn")

function makeCards(i){
  setTimeout(() => {
  var player = teamPlayers[i];
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
    if(player.leagues.standard.jersey == null)
      frontP.innerHTML = "No Jersey # Available";
    else
      frontP.innerHTML = "Jersey #: " + player.leagues.standard.jersey;
    first.appendChild(frontP);

    var cardImage = document.createElement('img');
    cardImage.setAttribute('src', response.value[0].contentUrl);
    cardImage.setAttribute('class', 'card-image');
    first.appendChild(cardImage);  

    var second = document.createElement("div");
    second.setAttribute("class","back");
    card.appendChild(second);

    var backHeader = document.createElement("h2");
    backHeader.innerHTML = "Average Season Stats"
    second.appendChild(backHeader);
    var backP = document.createElement("p");
    second.appendChild(backP);

    var li = document.createElement("li")
    li.appendChild(label);
    cardItems.appendChild(li);
    });
  }, 370*i);
}

showCardBtn.addEventListener("click", function(event){
  userSeason = selection[0].children[0].getAttribute('value');
  if(userSeason !== ""){
    cardItems.innerHTML = "";
    playerStorage = [];
    getTeam().then( response => {
      for(let i = 0; i < teamPlayers.length; i++){
        makeCards(i);
    }});
  }
});

cardItems.addEventListener("click", function(event){
  var target = event.target;
  if(target.getAttribute('class') === "flipInput"){
    var userPlayer = target.getAttribute('data-field');
    getPlayerStats(userPlayer).then( response => {
      var backOfCardText = target.parentElement.children[1].children[1].children[1];
      var stats = playerStorage.find(obj => {return obj.id == teamPlayers[userPlayer].id}).stats;
      backOfCardText.innerHTML = "Average Points: " + stats.aPoints + "<br>" +
                                 "Average Assists: " + stats.aAssists + "<br>" +
                                 "Average Rebounds: " + stats.aTotReb + "<br>" +
                                 "Average FGP: " + stats.aFGP + "<br>";
    });
  }
})