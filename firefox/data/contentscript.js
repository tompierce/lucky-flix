var s = document.createElement('script');
s.src = "https://cdn.rawgit.com/tompierce/lucky-flix/pre-0.0.1/chrome/script.js";
s.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);