var s = document.createElement('script');
s.src = "https://rawgit.com/tompierce/lucky-flix/master/chrome/script.js";
s.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);