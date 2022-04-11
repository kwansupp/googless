

// alway start new tab enabled, send info to background.js
// localStorage["enabled"] = true;


var enabledState = localStorage["enabled"];
var n_services = 0;



// wait til page is completely loaded

$(document).ready(timeoutFn(function() {
// $(window).on("load", function() {
	console.log("DOMContent loaded");

	// insert modal with cards -- hide display
	$.when(injectModal()).done(function(){console.log("inject modal");});


	// observer.observe(document, {attributes: true, childList: true, characterData: true, subtree:true});
}, 5000));


// listen to toggle state change from popup
// listen for state change from popup
chrome.runtime.onMessage.addListener((request, sender, response) => {
	console.log("Toggle state change", request.enabled);
	// change state of enabled state
	enabledState = request.enabled;
	console.log("updated enabledState", enabledState);

	// send new enabled state
	console.log(n_services, localStorage["n_services"], enabledState);

	chrome.runtime.sendMessage({msg: "content: state change after toggle", n_services: n_services, enabled: enabledState});

	toggleModal(enabledState, n_services);

});

// listen for tab change - update n_services
document.addEventListener('visibilitychange', function() {
  console.log('tab changed');
  // run get services again
  services = getServices();

  // update n_services value
  n_services = services.length;
  console.log(enabledState, n_services);

  // send updated value to background
  if (document.visibilityState == "visible") {
  	chrome.runtime.sendMessage({msg: "content: tab changed, update values", n_services: n_services, enabled: enabledState});
  	toggleModal(enabledState, n_services);
  }
  

  

});

// return a new function to pass to document.ready
// that has a timeout wrapper on it
function timeoutFn(fn, t) {
    var fired = false;
    var timer;
    function run() {
        clearTimeout(timer);
        timer = null;
        if (!fired) {
            fired = true;
            fn();
        }
    }
    timer = setTimeout(run, t);
    return run;
}

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

function injectModal() {

	$.get(chrome.runtime.getURL('modal.html'), function(html) {
	    // $(data).appendTo('body');
	    // console.log($);
	    $($.parseHTML(html)).appendTo('body');
	    console.log("injected modal.html");
	    // trigger looking for services
	    // look for services on page
		var services = getServices();
		console.log(services);

		// save amount of services to storage for popup to access info
		n_services = services.length;
		localStorage["n_services"] = services.length;
		// send amount of services and found and enabled state to popup
		chrome.runtime.sendMessage({msg: "content: modal injected", n_services: services.length, enabled: enabledState});


		// inject service cards into modal
		injectServiceCards(services);

		// if enabled, display modal
		toggleModal(localStorage["enabled"], n_services);

	});
	
}

function toggleModal(state, n_services) {
	// console.log("toggleModal() called");
	// console.log(localStorage["n_services"]);
	console.log(state);
	if (state == "true" && n_services> 0) {
	    console.log("show modal");
	    // $("#googless-container").show();
	    document.getElementById("googless-container").style.display = "block";
	} else {
	    console.log("hide modal");
	    // $("#googless-container").hide();
	    document.getElementById("googless-container").style.display = "none";
	    if(n_services == 0) {
	    	console.log("modal not shown, because n_services = 0");
	    }
	}

	// send state change
    chrome.runtime.sendMessage({msg: "content: state change after toggle", n_services: n_services, enabled: state});
}


function injectServiceCards(services) {
	console.log("injecting service cards");
	// console.log(services);
	// load in service data
	service_data = [
		{
			"id": "gstatic",
			"name": "Google",
			"icon": "icons/googless.svg",
			"lottie": "#",
			"description": "Google is also able to track you on their own websites, which is why we blocked those too.",
			"info_url": "https://www.googless.xyz/"
		},
		{
			"id": "gfonts",
			"name": "Google Fonts",
			"icon": "icons/fonts.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7d5c9cf48aadf17e2a_00%20fonts.json",
			"description": "A free service which allows website owners to use a wide variety of fonts.",
			"info_url": "https://www.googless.xyz/services/fonts"
		},
		{
			"id": "gmaps",
			"name": "Google Maps Embed",
			"icon": "icons/locations.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7eb725a340a6b157f2_00%20maps.json",
			"description": "A free service that can be integrated on a website, displaying a map with a specific location.",
			"info_url": "https://www.googless.xyz/services/maps"
		},
		{
			"id": "ga",
			"name": "Google Analytics & Tag Manager",
			"icon": "icons/analytics.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7c19182ba58e81f75e_00%20Analaylitcs.json",
			"description": "Can be used together to analyse web traffic and to gain an understanding of the performance of ads.",
			"info_url": "https://www.googless.xyz/services/google-analytics-tag-manager"
		},
		{
			"id": "gsi",
			"name": "Google Identity Services",
			"icon": "icons/gsi.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7c4ffeae05616d1694_00%20authenticator.json",
			"description": "A free tool which allows users to log in or create account on a website by linking their Google account to it.",
			"info_url": "https://www.googless.xyz/services/google-identity-services"
		},
		{
			"id": "recaptcha",
			"name": "Google ReCAPTCHA",
			"icon": "icons/recaptcha.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7e69569457d1f8c2bd_00%20Recaptcha.json",
			"description": "A Google owned service which is used to separate human website visitors from bots.",
			"info_url": "https://www.googless.xyz/services/recaptcha"
		},
		{
			"id": "gse",
			"name": "Google Search",
			"icon": "icons/search.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7f3aac5ae65abf8d90_00%20search.json",
			"description": "The widely popular search engine on the internet that can also be implemented within wesbites.",
			"info_url": "https://www.googless.xyz/services/search"
		},
		{
			"id": "youtube",
			"name": "YouTube Embed",
			"icon": "icons/youtube.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7f6be9f925f9919e95_00%20youtube.json",
			"description": "Hosts videos and often embeded across different sites as a default video player.",
			"info_url": "https://www.googless.xyz/services/youtube"
		},
		{
			"id": "adsense",
			"name": "Google Adsense & Doubleclick",
			"icon": "icons/adsense.svg",
			"lottie": "https://uploads-ssl.webflow.com/610cfca1961c95744bac560b/61449b7bb4fb9451baea4003_00%20Adsense.json",
			"description": "Both are services which allow advertisers to measure the performance of their ads.",
			"info_url": "https://www.googless.xyz/services/google-adsense-doubleclick"
		}
	];

	var service_obj;
	var name;
	var html;
	
	for (var i = 0; i < services.length; i++) {

		// insert info based on card id
		card_id = services[i];
		console.log("id", card_id);

		// add card template
		html_str = `<div id="googless-${card_id}" class="service-card active">
			<div class="googless-icon">
				<img src="#">
			</div>
			<div class="googless-info">
				<p class="service-title">Service Title</p>
				<p class="service-description"></p>
				<p class="service-link"><a href="#" target="_blank">Find Out More</a></p>
			</div>
		</div>`
		html = $.parseHTML(html_str);
		console.log(html);

		//  append service card html to service container
		$(html).appendTo('#service-container');
		console.log("service card added");

		// insert info (icon, title, description, url_link)
		googless_elem = '#googless-' + card_id;
		icon_elem = googless_elem + ' .googless-icon img';
		title_elem = googless_elem + ' .service-title';
		descr_elem = googless_elem + ' .service-description';
		link_elem = googless_elem + ' .service-link a';

		// grab info to add
		service_obj = service_data.find(service => service.id == card_id);
		// console.log('service obj', service_obj);

		// change title text
		$(title_elem).text(service_obj["name"]);
		// change description text
		$(descr_elem).text(service_obj["description"]);
		// change link url
		console.log($(link_elem));
		$(link_elem)[0].setAttribute("href", service_obj["info_url"]);
		// add icon link
		$(icon_elem)[0].setAttribute("src", chrome.runtime.getURL(service_obj["icon"]));
	}
}

function getServices() {
	// grab HTML head content
	var headContent = document.head.innerHTML;
	// console.log(headContent);
	// grab HTML body content
	var bodyContent = document.body.innerHTML;

	// list to store google services found
	var services = [];

	// CHECK HEAD
	// check for google analytics - analytics.js or gtag.js
	if (headContent.includes("analytics.js") || headContent.includes("gtag.js") || headContent.includes("ga.js") || headContent.includes("gtag/js")) {
		// alert("CONTAINS GOOGLE ANALYTICS!");
		services.push("ga");
	}

	if (headContent.includes("www.gstatic.com")) {
		// alert("CONTAINS GSTATIC!")
		services.push("gstatic");
	}

	// get all link elements
	var links = document.getElementsByTagName("link");
	for (var i=0; i < links.length; i++) {
		// check if any link element is google fonts
		if (links[i].href.includes("https://fonts.googleapis.com")) {
			services.push("gfonts");
			break;
		}

		if (links[i].href.includes("accounts.google.com/gsi")) {
			services.push("gsi");
			break;
		}
	}

	// CHECK BODY
	// get all scripts
	var scripts = document.getElementsByTagName("script");
	// var scripts = document.scripts;
	// loop through links to look for services
	for (var i=0; i < scripts.length; i++) {
		// if (scripts[i].src) {
		// 	console.log(i, scripts[i].src);
		// } else {
		// 	console.log(i, scripts[i].innerHTML);
		// }
		// console.log(i, scripts[i].src);

		// gsi
		if (scripts[i].src.includes("gsi/client") || scripts[i].src.includes("apis.google.com/js") || scripts[i].src.includes("ssl.gstatic.com/accounts")) {
			services.push("gsi");
		}

		// recaptcha
		if (scripts[i].src.includes("https://www.google.com/recaptcha/api.js")) {
			services.push("recaptcha");
		}

		// gcse
		if (scripts[i].src.includes("https://cse.google.com/cse.js") || scripts[i].src.includes("/cse.js")) {
			services.push("gse");
		}

		// adsense
		if (scripts[i].src.includes("//cse.google.com/adsense/search/async-ads.js") || scripts[i].src.includes("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js") || scripts[i].src.includes("/tag/js/gpt.js")) {
			services.push("adsense");
		}

		// gmaps
		if (scripts[i].innerHTML.includes("https://maps.googleapis.com/maps/api/")) {
			services.push("gmaps");
		}
		// if (scripts[i].src.includes("https://www.google.com/maps/embed/v1/") || scripts[i].src.includes("https://maps.googleapis.com/maps/api/")) {
		// 	services.push("gmaps");
		// }
	}

	// get all iframes
	var iframes = document.getElementsByTagName("iframe");
	// console.log(iframes);
	
	for (var i=0; i < iframes.length; i++) {
		// check if any youtube embeds
		if (iframes[i].src.includes("www.youtube.com")) {
			services.push("youtube");
		}
		// check gsi
		// if (iframes[i].src.includes("accounts.google.com/gsi")) {
		// 	services.push("gsi");
		// }
	}
	


	// clean up by giving only unique values in list
	services = [...new Set(services)];

	// console.log(services);
	return services;
}
