var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: ["http://www.netflix.com/WiHome", "https://www.netflix.com/WiHome"],
	contentScriptFile: data.url("contentscript.js")
});