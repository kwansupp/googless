
console.log("popup open");
console.log("plugin enabled?", localStorage["enabled"]);

var toggle = document.getElementById("checkbox");
var number_target = document.getElementById("nService");
var status_text = document.getElementById("status-text");
var n_services = 0;

// get number of services and update info
if (localStorage["n_services"] != undefined) {
    state = localStorage["enabled"];
    n_services = localStorage["n_services"];
}
console.log("popup n_services", n_services);
number_target.innerText = n_services;

// get state of plugin and change toggle button accordingly
if (localStorage["enabled"] == "true") {
    // console.log("GO ON");
    toggle.checked = true;
} else {
    // console.log("OFF");
    toggle.checked = false;
}
toggleStatusText();

// listen to toggle button change
toggle.addEventListener('change', (e) => {
    toggleStatusText();
//     state = toggle.checked;
    // update state
    if (toggle.checked)
    {
        localStorage["enabled"] = true;

        console.log(localStorage["enabled"]);
        // state = true;
        // number_target.innerText = "on";
    } else {
        localStorage["enabled"] = false;
        console.log(localStorage["enabled"]);
        // state = false;
        // number_target.innerText = "off";
    }

    // send state to background.js
    let queryOptions = { active: true, currentWindow: true };
    let tab = chrome.tabs.query(queryOptions);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { msg: "popup: state toggled", enabled: localStorage["enabled"]}, (response) => {
    //         if (response) {
    //             // do cool things with the response
    //             // ...
    //         }
        });
    });
});


// function to change enabled status text
function toggleStatusText() {
    if (toggle.checked) {
        status_text.innerText = "Enabled";
    } else {
        status_text.innerText = "Disabled";
    }
}



