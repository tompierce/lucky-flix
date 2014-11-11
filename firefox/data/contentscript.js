/////////////////////////////////
// Firefox specific re-defines //
/////////////////////////////////
var netflix = unsafeWindow.netflix;
var jQuery = $;

// Initialise
var LOG = 'lucky-flix: ';
console.log(LOG, 'Initialising...');

//////////////////////////////////////////////////
// Get unique list of movieids/urls on homepage //
//////////////////////////////////////////////////

var videoList = [];

var unique = function(a, compareFunc) {
	a.sort(compareFunc);
	for (var i = 1; i < a.length;) {
		if (compareFunc(a[i - 1], a[i]) === 0) {
			a.splice(i, 1);
		} else {
			i++;
		}
	}
	return a;
};

jQuery('.playLink').each(function(i, el) {
	jqObj = jQuery(el);
	var url = jqObj.attr('href').split('&')[0];
	var title = jqObj.siblings('img').attr('alt');
	var movieId = url.substr(url.length - 8);

	videoList.push({
		title: title,
		url: url,
		movieid: movieId
	});
});

var uniqueList = unique(videoList, function(a, b) {
	return (a.title > b.title ? 1 : (a.title < b.title ? -1 : 0));
});

var randInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

//////////////////////////////////////////////////
// Get a random video, use it's BOB metadata to //
// determine if it's a film                     //
//////////////////////////////////////////////////

var getRandomVideo = function() {

	var randomVideo = uniqueList[randInt(0, uniqueList.length)];

	jQuery.ajax({
		url: 'http://www.netflix.com/JSON/BOB',
		data: {
			authURL: netflix.Link.getXsrfToken(),
			movieid: String(randomVideo.movieid)
		},
		type: 'GET'
	}).done(function(data, message, jqxhr) {

		var el = jQuery('<div></div>');
		el.html(data.html);

		try {
			var duration = jQuery('.duration', el).html().trim();
			console.log(LOG, 'Video [', randomVideo.title, duration, ']');
			if (duration.indexOf('minutes') > 0) {
				var durationInMins = Number(duration.match(/\d+/g)[0]);
				if (durationInMins > 59) {
					console.log(LOG, 'FILM!');
					window.location.href = randomVideo.url;
				} else {
					getRandomVideo();
				}
			} else {
				getRandomVideo();
			}
		} catch (e) {
			getRandomVideo();
		}

	}).fail(function(jqxhr, message, error) {
		getRandomVideo();
	});

};

///////////////////////////////////////////
// Add Get Lucky button to global-header //
///////////////////////////////////////////

var html = '';
html += '<li id="rTab" class="nav-item-large nav-item">';
html += '<span class="i-b content">';
html += '<a href="#" id="getLuckyBtn"><span class="icon-star"></span> Get Lucky</a>';
html += '</span>';
html += '<span class="i-b shim"></span>';
html += '<span class="down-arrow"></span>';
html += '<span class="down-arrow-shadow"></span>';
html += '</li>';

jQuery('#global-header').append(html);

console.log(LOG, 'button added.');

jQuery('#getLuckyBtn').on('click', function() {
	console.log(LOG, 'get lucky clicked.');
	getRandomVideo();
});