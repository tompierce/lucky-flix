/////////////////////////////////
// Firefox specific re-defines //
/////////////////////////////////
var netflix = unsafeWindow.netflix;
var jQuery  = $;

// Initialise
var LOG = 'lucky-flix: ';
console.log(LOG, 'Initialising...');

//////////////////////////////////////////////////
// Get unique list of movieids/urls on homepage //
//////////////////////////////////////////////////

var videoList = [];

var unique = function(a, compareFunc){
    a.sort( compareFunc );
    for(var i = 1; i < a.length; ){
        if( compareFunc(a[i-1], a[i]) === 0){
            a.splice(i, 1);
        } else {
            i++;
        }
    }
    return a;
};

jQuery('.playLink').each(function(i, el){
	jqObj       = jQuery(el);
	var url     = jqObj.attr('href').split('&')[0];
	var title   = jqObj.siblings('img').attr('alt');
	var movieId = url.substr(url.length - 8);

	videoList.push({
		title: title, 
		url: url, 
		movieid: movieId
	});
});

var uniqueList = unique(videoList, function(a,b){
	return (a.title > b.title ? 1 : (a.title<b.title ? -1 : 0 ));
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
			var rating   = jQuery('.mpaaRating', el).html().trim();
			var year     = jQuery('.year', el).html().trim();
			var img      = jQuery('.boxShotImg', el);
			console.log(LOG, 'Video [', randomVideo.title, duration, ']');
			if (duration.indexOf('minutes') > 0) {
				var durationInMins = Number(duration.match(/\d+/g)[0]);
				if (durationInMins > 59) {
					$('#lucky-flix-popup').empty();
					$('#lucky-flix-popup').append($('<h2>').text(randomVideo.title));
					$('#lucky-flix-popup').append($('<p>'));
					$('#lucky-flix-popup').append($('<img>', {src: img.attr('src')}));
					$('#lucky-flix-popup').append($('<div>', {id: 'lucky-flix-data-container', style: 'display: block;'}));
					$('#lucky-flix-data-container').append($('<span>').text(duration));
					$('#lucky-flix-data-container').append('    ');
					$('#lucky-flix-data-container').append($('<span>').text(rating));
					$('#lucky-flix-data-container').append('    ');
					$('#lucky-flix-data-container').append($('<span>').text(year));
					$('#lucky-flix-popup').append($('<div>', {id: 'lucky-flix-btn-container', style: 'display: block;'}));
					$('#lucky-flix-btn-container').append($('<a>', {href:'#'}).text('Watch It Now').addClass('lucky-flix-btn').click(function(){
						window.location.href = randomVideo.url;					
					}));
					$('#lucky-flix-popup').popup('show');
				} else {
					getRandomVideo();
				}
			} else {
				getRandomVideo();
			}
		} catch(e) {
			getRandomVideo();
		}

	}).fail(function(jqxhr, message, error) {
		getRandomVideo();
	});

};

///////////////////////////////////////////
// Add Get Lucky button to global-header //
///////////////////////////////////////////

// var html = '';
// html += '<li id="luck-flix" class="nav-item-large nav-item">';
// html += '<span class="i-b content">';
// html += '<a href="#" id="getLuckyBtn"><span class="icon-star"></span> Get Lucky</a>';
// html += '</span>';
// html += '<span class="i-b shim"></span>';
// html += '<span class="down-arrow"></span>';
// html += '<span class="down-arrow-shadow"></span>';
// html += '</li>';

// jQuery('#global-header').append(html);

jQuery('#global-header').append($('<li>', {id:'lucky-flix'}).addClass('nav-item-large nav-item'));
jQuery('li#lucky-flix').append($('<span>').addClass('i-b content'));
jQuery('li#lucky-flix span').append($('<a>', {href: '#', id: 'getLuckyBtn'}).text('Get Lucky'));
jQuery('li#lucky-flix').append($('<span>').addClass('i-b shim'));
jQuery('li#lucky-flix').append($('<span>').addClass('down-arrow'));
jQuery('li#lucky-flix').append($('<span>').addClass('down-arrow-shadow'));

console.log(LOG, 'button added.');

jQuery('body').append($('<div>', {id: 'lucky-flix-popup'}));
jQuery('body').append($('<style>').text('.lucky-flix-btn { display:inline-block; padding: 10px !important; margin: 10px !important; background: #3498db; font-family: arial,sans-serif; color: #ffffff; font-size: 20px; text-decoration: none; } .lucky-flix-btn:hover { text-decoration: none; background: #3cb0fd; }'));


$('#lucky-flix-popup').popup();
$('#lucky-flix-popup')
	.css('width', '300px')
	.css('padding', '20px')
	.css('margin', '20px')
	.css('text-align', 'center')
	.css('background-color', 'white');

jQuery('#getLuckyBtn').on('click', function(e) {
	console.log(LOG, 'get lucky clicked.');
	getRandomVideo();
});