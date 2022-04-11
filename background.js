// initial values after installation of plugin
// set plugin state on
localStorage["enabled"] = true;

// listen for when new tab created

// listen for when tab changed
// run getServices again to update n_services


// // listen to changes in storage value
// window.addEventListener('storage', () => {
//   // When local storage changes, dump the list to
//   // the console.
//   console.log("storage value changed", localStorage["enabled"]);
// });


// listen for info from content (services count and enabled state)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	localStorage["n_services"] = request.n_services;
	localStorage["enabled"] = request.enabled;
});