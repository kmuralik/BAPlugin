// DECLARE VARIABLES
var SnippetParamsLoaded = false;

var Src="src";
var Id="id";
var ProfileUrl="data-profileUrl";
var TenantId="data-tenantID";
var AppId="data-appID";
var AppKey="data-appKey";

var BASrcValue="https://axanp.saas.ca.com/mdo/v1/sdks/browser/BA.js"; 
var BAExtSrcValue="https://axanp.saas.ca.com/mdo/v1/sdks/browser/BAExt.js"; 
var IdValue="ca_eum_ba";
var ProfileUrlValue="" 
var TenantIdValue="956958BA-9A0F-D96E-51F4-4F9B71578865";
var AppIdValue=""; 
var AppKeyValue=""; 

var lookup_loc="";
var user_id="";
var user_name="";

var LoginName = "";
var FullName = "";

$(document).ready(function() {
	console.log("[0] document is ready for processing");
	var currentUrl = window.location.href;
	if(SetSnippetParams(currentUrl)){
		// get username
		console.log("[2] Capturing user details");
		switch(lookup_loc){
			case "cookie":
				//
				//var LDAPID = document.cookie.replace(/(?:(?:^|.*;\s*)pcID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
				//var fullName = document.cookie.replace(/(?:(?:^|.*;\s*)pcFNAME\s*\=\s*([^;]*).*$)|^.*$/, "$1");
				LoginName = getCookie(user_id);
				FullName = getCookie(user_name);
				//console.log("\t--> " + user_id + " : "+LoginName);
				//console.log("\t--> " + user_name + " : "+FullName);
				break;
			case "body|class":
				LoginName = $('.'+user_id).first().text();
				FullName = $('.'+user_name).first().text();
				//console.log("\t--> LoginName : "+LoginName);
				//console.log("\t--> FullName : "+FullName);
				break;
		}
		//
		console.log("\t" + LoginName + " : " + FullName);
		console.log("[3] Set Customer Details cookie");
		document.cookie = "BALogin=" + LoginName;
		document.cookie = "BAUser=" + FullName;
		//
	}else{
		console.log("\tTab URL (" + tabUrl + ") is not supported");
	}
	//
});

// trigger on receiving message
chrome.extension.onMessage.addListener(function(request, sender, response) {	
	if (request.type === 'getDoc') {
		console.log("[4] Got the message getDoc. Doing the job");
		doTheJob(request.url);
	}
	return true;
});

// PRIVATE FUNCTIONS
function doTheJob(tabUrl){
	if(SnippetParamsLoaded==true){
		loadBAScripts();
		console.log("[6] Injecting Script");	
		injectScript(chrome.extension.getURL('PFMKey.js'), 'body');		
	}
}

// FIND OUT THE TAB URL IS SUPPORTED ONE
function SetSnippetParams(tabUrl){
	console.log("[1] Finding matches for " + tabUrl);
	var match = 0;
	$.each(snippetVars.snippet.vars, function(i, v) {
		if(match == 0){
			if (tabUrl.indexOf(v.ref_url) >= 0 ){
				match++;
				console.log("\tMatched ref_url --> "+v.ref_url);
				ProfileUrlValue = v.profile_url;
				AppIdValue = v.app_id;
				AppKeyValue = v.app_key;
				//
				lookup_loc = v.lookup_loc;
				user_id = v.user_id;
				user_name = v.user_name;
			}
		}
	});
	//
	if(match == 0){
		console.log("\tSetSnippetVars returning false");
		chrome.runtime.sendMessage(null, {changeIcon: 'inactive'}, null);
		SnippetParamsLoaded = false;
		return false;
	} else {
		console.log("\tsnippet vars updated");
		chrome.runtime.sendMessage(null, {changeIcon: 'active'}, null);
		SnippetParamsLoaded = true;
		return true;
	}
}

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];	
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
	
	if(typeof node === 'undefined'){
		document.head.appendChild(script);
		console.log("\t" + file_path + " loaded to head successfully");
	}else{
		node.appendChild(script);
		console.log("\t" + file_path + " loaded to " + tag + " successfully");
	}
}

function loadBAScripts(){
	// append external BAExt script to current document
	console.log("[5] Loading BA Plugins");
	try{
		var extScript = document.createElement('script');
		extScript.setAttribute(Src, BAExtSrcValue);
		document.head.appendChild(extScript);
		console.log("\tBAExt.js loaded successfully");
	}catch(error){
		console.log("\tError while loading BAExt.js \n" + error);
	}
	// append external BA script to the current document
	try{
		var parentScript = document.createElement('script');
		parentScript.setAttribute(Src, BASrcValue);
		parentScript.setAttribute(Id, IdValue);
		parentScript.setAttribute(ProfileUrl,ProfileUrlValue);
		parentScript.setAttribute(TenantId,TenantIdValue);
		parentScript.setAttribute(AppId,AppIdValue);
		parentScript.setAttribute(AppKey,AppKeyValue);
		document.head.appendChild(parentScript);
		console.log("\tBA.js loaded successfully");
	}catch(error){
		console.log("\tError while loading BA.js \n" + error);
	}
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
		//
		if(c.indexOf(name)>=0){
			// split at &
			var na = c.split('&');
			for(var j=0;j<na.length;j++){
				var n = na[j];
				while (n.charAt(0) == ' ') {
					n = n.substring(1);
				}
				if(n.indexOf(name) == 0){
					return decodeURIComponent(n.substring(name.length, n.length));
				}
			}
		}
    }
    return "";
}


