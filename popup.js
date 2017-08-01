var tabDomain="-1";
var BAEnabledLocal="BAEnabledLocal";
var BAEnabledContent="BAEnabledContent";
var BASnippetLocal="BASnippetLocal";
var BASnippetContent="BASnippetContent";
var SnippetSrc="src";
var SnippetId="id";
var SnippetProfileUrl="data-profileUrl";
var SnippetTenantId="data-tenantID";
var SnippetAppId="data-appID";
var SnippetAppKey="data-appKey";
var timeoutEndTime="timeoutEndTime";
var timeoutTime="timeoutTime";
var timeoutVal=1;


document.getElementById("enableBA").addEventListener("click", checkBoxListener);

function checkBoxListener(){
	if(getCheckBoxStatus()==true){
		//enable the Snippet input box
		enableSnipptInputBox();
		//enable the submit button
		enableSubmitButton();
	}
	else{
		if(getCheckBoxStatus()==false){
			//disable the Snippet input box
			disableSnipptInputBox();
			//disable the submit button
			disableSubmitButton();

			addToLocalStorage(BAEnabledLocal,false);

			//clear from the contentScript local storage
			addToContentScriptLocalStorage(BAEnabledContent,false);
			
			//refresh the page
			refreshAppPage();

			//cleanUp
			cleanUp();

			window.close();
		}
	}


}


document.getElementById("submit").addEventListener("click",validateAndExtractSnippet);



// ******** Utility functions ********

// Store the given key/value in the local storage of the extension
function addToLocalStorage(key,value){
	key=transformKey(key);
	window.localStorage.setItem(key,value);
}
// Retrieve the value for the given key from the local storage of the extension
function getFromLocalStorage(key){
	key=transformKey(key);
	return window.localStorage.getItem(key);
}
function removeFromLocalStorage(key){
	key=transformKey(key);
	window.localStorage.removeItem(key);	
}

function setCheckBox(){
	document.getElementById("enableBA").checked=true;
}
function clearCheckBox(){
	document.getElementById("enableBA").checked=false;
}
function disableCheckbox(){
	document.getElementById("enableBA").disabled=true;
}
function enableCheckBox(){
	document.getElementById("enableBA").disabled=false;
}

function enableSnipptInputBox(){
	document.getElementById("textarea").disabled=false;
}
function disableSnipptInputBox(){
	document.getElementById("textarea").disabled=true;
}

function setValueInSnippetInputBox(val){
	document.getElementById("textarea").value=val;
}

function enableSubmitButton(){
	document.getElementById("submit").disabled=false;
}
function disableSubmitButton(){
	document.getElementById("submit").disabled=true;
}

function getCheckBoxStatus(){
	return document.getElementById("enableBA").checked;
}
function validateAndExtractSnippet(){
	// Get the snippet from the snippet input box and 
	// and validate it and extract it and store in in local Storage

	 addToLocalStorage(BAEnabledLocal,true);
	 addToContentScriptLocalStorage(BAEnabledContent,true);
	 var snippet=document.getElementById("textarea").value;
	 var d=document.createElement('div');
	 d.innerHTML=snippet;
	 addToContentScriptLocalStorage(SnippetSrc,d.firstChild.getAttribute(SnippetSrc));
	 addToContentScriptLocalStorage(SnippetId,d.firstChild.getAttribute(SnippetId));
	 addToContentScriptLocalStorage(SnippetProfileUrl,d.firstChild.getAttribute(SnippetProfileUrl));
	 addToContentScriptLocalStorage(SnippetAppKey,d.firstChild.getAttribute(SnippetAppKey));
	 addToContentScriptLocalStorage(SnippetTenantId,d.firstChild.getAttribute(SnippetTenantId));
	 addToContentScriptLocalStorage(SnippetAppId,d.firstChild.getAttribute(SnippetAppId));
	 addToLocalStorage(BASnippetLocal,snippet);
	 addToContentScriptLocalStorage(BASnippetContent,true);
	  //get the selected timout value from the dropdown list
	 var timeoutSelector = document.getElementById("timeoutSelector");
	 timeoutVal= timeoutSelector.options[timeoutSelector.selectedIndex].value;
	 var endTime=getEndTime(timeoutVal);
	 addToLocalStorage(timeoutEndTime,endTime);
	 addToContentScriptLocalStorage(timeoutEndTime,endTime);
	 addToContentScriptLocalStorage(timeoutTime,timeoutVal);
	 refreshAppPage();

	 window.close();


}

function addToContentScriptLocalStorage(key,value){
	chrome.tabs.executeScript({
   			 code: 'window.localStorage.setItem("'+key+'","'+value+'")'
  		});
}
function refreshAppPage(){
	chrome.tabs.executeScript({
   			 code: 'window.location.reload(true)'
  		});
}
function getEndTime(timeoutVal){
	var currentTime=Date.now();
	return currentTime+(Number(timeoutVal)*60000);

}
function getCurrentTabDomain(){
	chrome.tabs.query({ currentWindow: true, active: true },
        function (tabArray) { 
        	 var url = new URL(tabArray[0].url);
  			 var domain = url.hostname;
        	tabDomain=domain;
        	init();
        });
}
function transformKey(key){
	return key+tabDomain;
}
function hideAll(){
	setStatus("Retrieving previous information");
	document.getElementById("enableBA").style.display="none";
	document.getElementById("textarea").style.display="none";
	document.getElementById("submit").style.display="none";
	document.getElementById("timeoutSelector").style.display="none";
}
function showAll(){
	document.getElementById("enableBA").style.display="inline";
	document.getElementById("textarea").style.display="block";
	document.getElementById("submit").style.display="block";
	document.getElementById("timeoutSelector").style.display="inline";

}
function setStatus(text){
	document.getElementById("status").innerHTML=text;
}
function cleanUp(){
	removeFromLocalStorage(timeoutEndTime);
	removeFromLocalStorage(BASnippetLocal);
}

// ******** End of Utility functions ********

//JS excutions starts here

function init(){
	showAll();
	enableCheckBox();
	setStatus("");
	
	if(getFromLocalStorage(timeoutEndTime)!== null){
		var time=Date.now();
		if(Number(getFromLocalStorage(timeoutEndTime))<time){
			addToLocalStorage(BAEnabledLocal,false);
		}
	}
	

	if(getFromLocalStorage(BAEnabledLocal)===null){

		addToLocalStorage(BAEnabledLocal,false);
		//uncheck the checkbox
		clearCheckBox();
		//disable Snippet input box
		disableSnipptInputBox();
		//disable the submit button
		disableSubmitButton();
		
	}
	else{
		if(getFromLocalStorage(BAEnabledLocal)=="true"){
			//Check the check box
			setCheckBox();
			//enable the Snippet input box
			enableSnipptInputBox();
			//enable the submit button
			enableSubmitButton();
			//Show the current snippet
			setValueInSnippetInputBox(getFromLocalStorage(BASnippetLocal));


		}
		if(getFromLocalStorage(BAEnabledLocal)=="false"){
			//Clear the check box
			clearCheckBox();
			//disable Snippet input box
			disableSnipptInputBox();
			//disable the submit button
			disableSubmitButton();

		}
	}
}
hideAll();
getCurrentTabDomain();

