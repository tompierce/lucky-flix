var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: ["http://www.netflix.com/WiHome", "https://www.netflix.com/WiHome"],
	contentScriptFile: [data.url("jquery-1.11.1.min.js"), data.url("contentscript.js")]
});