const bingSettings = {
	async: true,
	crossDomain: true,
	url: 'https://bing-image-search1.p.rapidapi.com/images/search?q=bread',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8',
		'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
	}
};

$.ajax(bingSettings).done(function (response) {
	console.log(response);
});

teamPlayers = [];


var nbaUrl = "https://api-nba-v1.p.rapidapi.com";
    var nbaSettings = {
      "url": nbaUrl,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "x-rapidapi-key": "09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8",
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
      },
    };


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
  let toSendUrl = "/players/" + "?" + "team=8" + "&" + "season=2022";
  setNBASettings(toSendUrl);


  $.ajax(nbaSettings).done(function (response) {
    console.log(response);
    teamPlayers = response.response;
  });
}


  function getPlayerStats() {
    let toSendUrl = "/players/statistics" + "?" + "id=" + teamPlayers[3].id + "&" + "season=2022" ;
    setNBASettings(toSendUrl);


    $.ajax(nbaSettings).done(function (response) {
      console.log(response);
    });
  }


  getTeam();
  setTimeout(() => {getPlayerStats();}, 1000);