// GET PMFKEY
var getPMFKey = function() {
	console.log("[7] Retrieving Customer Details from cookie");
	try {
		if(typeof window.BrowserAgentExtension === 'undefined') {
			setTimeout(getPMFKey, 500);
			return;
		}
		//
		// get the customer id params		
		var LoginName = getCookie("BALogin");
		var FullName = getCookie("BAUser");
		// 		
		// delete these temp cookies
		document.cookie = "BALogin=; expires="+new Date().toUTCString()+";path=/";
		document.cookie = "BAUser=; expires="+new Date().toUTCString()+";path=/";
		// trim unwanted spaces
		LoginName = LoginName.trim();
		FullName = FullName.trim();
		console.log("\t" + LoginName + " : " + FullName);
		//
		console.log("[8] Setting Customer ID");
		var event = "";
		if(LoginName == ""){
			event = { "customerId": FullName , "attributes": { "Full Name": FullName} };
		} else {
			event = { "customerId": LoginName , "attributes": { "Full Name": FullName} };
		}
		console.log("\tEvent Prepared [" + JSON.stringify(event) + "]");
		//
		window.BrowserAgentExtension.setCustomerId(event);
		console.log("\tCustomer ID set successfully");
	} catch(e) {
		console.log("\tCould not set customer ID because " + e.message);
	}
};

var sendPageLoad = function() {
	try {
		if(typeof window.BrowserAgent === 'undefined') {
			setTimeout(sendPageLoad, 500);
			return;
		}
		BrowserAgent.pageUtils.onloadHelper();
	} catch(e) {
		console.log("Could not send pageload \n" + e.message);
	}
};

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

sendPageLoad();
getPMFKey();