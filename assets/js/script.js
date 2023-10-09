const settings = {
	async: true,
	crossDomain: true,
	url: 'https://bing-image-search1.p.rapidapi.com/images/search?q=dallas',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '09e77c0237msh7cf79c6d0985d69p119f9cjsnb5866ab39fe8',
		'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
  console.log(response);
});