var settings = {
    "url": 'https://api-nba-v1.p.rapidapi.com/players/statistics?2&season=2020&id=1610612742', 
    "method": "GET",
    "timeout": 0,
    "headers": {
      "x-rapidapi-key": "09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8",
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
    },
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });