function afterPageLoad() {

	// synchronously load scripts
	loadScript('jquery-1.11.1.min.js', function() {
		loadScript('jquery.popupoverlay.js', function() {
			loadScript('script.js');
		});
	});
	
}

function loadScript(name, callback) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(name);
	s.onload = function() {
		this.parentNode.removeChild(this);
		if (callback) callback();
	};
	(document.head || document.documentElement).appendChild(s);
}

window.addEventListener('DOMContentLoaded', function() {
	afterPageLoad();
});
