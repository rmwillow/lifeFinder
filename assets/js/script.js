// start Modals
// alert modal will replace any default alerts
var alertModal = function() {
    // select the page and disables the scroll by adding respective classes(from framework)
    var htmlEl = document.querySelector("html");
    htmlEl.classList.add("is-clipped");
    // select modal div and render on page(styles are from framework)
    var modalEl = document.querySelector("#alert");
    modalEl.classList.add("is-active");
};
// close modals by removing the respective classes
var closeModalBtn = function() {
    var htmlEl = document.querySelector("html");
    htmlEl.classList.remove("is-clipped");
    var modalEl = document.querySelector("#alert");
    modalEl.classList.remove("is-active");
};
// "close button" on modals will close them
document.querySelector(".modal-close").addEventListener("click", closeModalBtn);
// by clicking anywhere on page, mpdals will close aswell
document
    .querySelector(".modal-background")
    .addEventListener("click", closeModalBtn);
// end Modals

// start address autocomplete(this is copied from Google documentation, and simplified)
var autocomplete;
var searchEl = document.getElementById("autocomplete");

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (searchEl), {
            // options(from google documentation)
            types: ["geocode"],
            componentRestrictions: { country: "us" },
        }
    );
    // When the user selects an address from the dropdown, Call any function instead of Modal, Modal is for testing purposes;
    // autocomplete.addListener('place_changed', sampleModal);
}

// end address auto complete
function initialLocation() {
    // fetch IP of user (first API for our app, identifies the users exact location by IP address)
    var IPapiKey = "602f8d85bc584bb4b0b520771a9d3287";
    var IPapi = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + IPapiKey;
    fetch(IPapi)
        .then((r) => r.json())
        .then((d) => {
            // assign user's lat/long to variables to be used by Google Places
            searchLat = d.latitude;
            searchLng = d.longitude;
            initMap();
        });
}
initialLocation();

//button click and button data storage
//getting elements name
document.getElementById("search").onclick = function() {
    searchBar();
};
document.getElementById("allID").onclick = function() {
    getAll();
};
document.getElementById("groceryID").onclick = function() {
    getGroceries();
};
document.getElementById("churchID").onclick = function() {
    getChurches();
};
document.getElementById("schoolID").onclick = function() {
    getSchools();
};
document.getElementById("hospitalID").onclick = function() {
    getHospitals();
};

var searchLat;
var searchLng;
var searchedAddress = [];

function cityButtons(addressSearch) {
    fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${addressSearch}&key=AIzaSyBtQgwtmt7aoZSZHJo2BT50rx2nqbZb8Tw`
        )
        .then((response) => response.json())
        .then((data) => {
            let fullAddress = data.results[0].formatted_address;
            // Create a iterable that will select the <div> where the city will be displayed
            let responseContainerEl = document.getElementById("buttonsContainer");
            let addressBtn = document.createElement("BUTTON");
            addressBtn.setAttribute("src", fullAddress);
            addressBtn.textContent = fullAddress;
            addressBtn.className =
                "button is-info is-outlined is-medium is-fullwidth";
            addressBtn.style = "margin: 10px; justify-content: center;";
            // Append to the button
            //document.body.appendChild(addressBtn);
            responseContainerEl.append(addressBtn);

            //local storage
            //create a list to store lat and long in
            //push lat and long variables into list
            searchedAddress.push(fullAddress);

            //store list in local storage with the name of lat, long
            localStorage.setItem("savedLocations", JSON.stringify(searchedAddress));

            //onclick city name will load data with no fetch request
            addressBtn.onclick = function() {
                document.getElementById("places-list").innerHTML = "";
                //call fetch again for onclick of buttons to make data dynamic
                fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${addressSearch}&key=AIzaSyBtQgwtmt7aoZSZHJo2BT50rx2nqbZb8Tw`
                    )
                    .then((response) => response.json())
                    .then((data) => {
                        //calling vars again because of init map
                        var userInputLat = data.results[0].geometry.location.lat;
                        var userInputLng = data.results[0].geometry.location.lng;
                        searchLat = userInputLat;
                        searchLng = userInputLng;
                        initMap();
                    });
            };
        });
}

function searchBar() {
    // retrieve the search bar value and store it into variable to be used by HERE API
    var addressSearch = searchEl.value;

    //this is where chris code call from the api lat long will go to call google maps
    document.getElementById("places-list").innerHTML = "";

    fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${addressSearch}&key=AIzaSyBtQgwtmt7aoZSZHJo2BT50rx2nqbZb8Tw`
        )
        .then((response) => response.json())
        .then((data) => {
            var userInputLat = data.results[0].geometry.location.lat;
            var userInputLng = data.results[0].geometry.location.lng;

            searchLat = userInputLat;
            searchLng = userInputLng;

            initMap();
        });
    cityButtons(addressSearch);
}

function retrieveAddressButtons() {
    var searchedLocations = JSON.parse(localStorage.getItem("savedLocations"));
    if (searchedLocations) {
        for (var i = 0; i < searchedLocations.length; i++) {
            var savedAddress = searchedLocations[i];
            addressSearch = savedAddress;
            document.getElementById("places-list").innerHTML = "";
            cityButtons(addressSearch);
        }
    }
}

//clears page and buttonsContainer
var clearEl = document.getElementById("clear");
clearEl.className =
    "button is-danger is-light is-outlined is-medium is-fullwidth";
clearEl.style = "margin: 10px; justify-content: center;";
clearEl.onclick = function() {
    localStorage.clear();
    window.location.reload();
};

retrieveAddressButtons();
//function to run user button click data into variables and displays all options on page in a list
function getAll() {
    searchWord = searchEl.value;
    document.getElementById("places-list").innerHTML = "";
    initMap();
}

//function to run user button click data into variables and displays on page in a list
function getGroceries() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "supermarket";
    initMap();
}

//function to run user button click data into variables and displays on page for groceries in a list
function getChurches() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "church";
    initMap();
}

//function to run user button click data into variables and displays on page for schools in a list
function getSchools() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "school";
    initMap();
}
//function to run user button click data into variables and displays on page for hospitals in a list
function getHospitals() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "hospital";
    initMap();
}

var searchWord;

function initMap() {
    // Create the map.
    const searchedLocation = { lat: searchLat, lng: searchLng };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: searchedLocation,
        zoom: 17,
        minZoom: 8,
        maxZoom: 14,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function() {
        moreButton.disabled = true;

        if (getNextPage) {
            getNextPage();
        }
    };

    // Perform a nearby search.
    service.nearbySearch({ location: searchedLocation, radius: 2000, type: searchWord },
        (results, status, pagination) => {
            if (status !== "OK" || !results) return;
            addPlaces(results, map);
            moreButton.disabled = !pagination || !pagination.hasNextPage;

            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                };
            }
        }
    );
}

function addPlaces(places, map) {
    const placesList = document.getElementById("list-container");
    const placesDisplay = document.getElementById("places-list");
    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
            };
            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
            });
            const itemContainer = document.createElement("div");
            const li = document.createElement("div");
            const img = document.createElement("img");
            img.setAttribute("src", place.icon);
            itemContainer.classList =
                "panel-block button is-light is-large is-outlined";
            li.classList = "panel-block is-active";
            li.textContent = place.name;
            placesDisplay.appendChild(itemContainer);
            itemContainer.appendChild(img);
            itemContainer.appendChild(li);
            itemContainer.style = "margin: 10px; contain: content;";

            itemContainer.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
            });
        }
    }
}