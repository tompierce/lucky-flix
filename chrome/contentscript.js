function afterPageLoad() {
	loadScript('jquery-1.11.1.min.js');
	loadScript('jquery.popupoverlay.js');
	loadScript('script.js');
}

function loadScript(name) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(name);
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head || document.documentElement).appendChild(s);
}

window.addEventListener('DOMContentLoaded', function() {
	afterPageLoad();
});
