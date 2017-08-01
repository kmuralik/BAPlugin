chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === 'complete') {	
		console.log("[1] sending getDoc on complete event");
		chrome.tabs.sendMessage(tabId, {type: 'getDoc', url: tab.url}, null);
	}
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(sender.tab ?
    //            "from a content script:" + sender.tab.url +": "+sender.tab.id:
    //            "from the extension");
	
    if (request.changeIcon = "inactive"){
     	if(sender.tab){
     		chrome.browserAction.setIcon({ tabId: sender.tab.id,path: "CA-logo-inactive.png"});
     		var url1 = new URL(sender.tab.url);
  			var domain1= url.hostname;
     		window.localStorage.setItem(BAEnabledLocal+domain1,'false');
     	}
     	else{
     		chrome.browserAction.setIcon({ path: "CA-logo-inactive.png"});
     	}
 	}

 	if (request.changeIcon == "active"){
 		if(sender.tab){
     		chrome.browserAction.setIcon({ tabId: sender.tab.id,path: "CA-logo-active.png"});
     	}
 	}
  });