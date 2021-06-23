// Start global variables

// autocomplete variables
var autocomplete;
var searchEl = document.getElementById('autocomplete');
// google places variables
var searchLat;
var searchLng;
var searchWord;

//getting elements name
var searchBtnEl = document.getElementById("search");
var allIdEl = document.getElementById("allID");
var groceryIdEl = document.getElementById("groceryID");
var churchIdEl = document.getElementById("churchID");
var schoolIdEl = document.getElementById("schoolID");
var hospitalIdEl = document.getElementById("hospitalID");

// End global variables

// Start Modals
// alert modal will replace any default alerts
var alertModal = function () {
    // select the page and disables the scroll by adding respective classes(from framework)
    var htmlEl = document.querySelector('html');
    htmlEl.classList.add('is-clipped');
    // select modal div and render on page(styles are from framework)
    var modalEl = document.querySelector('#alert');
    modalEl.classList.add('is-active')
};
// close modals by removing the respective classes
var closeModalBtn = function () {
    var htmlEl = document.querySelector('html');
    htmlEl.classList.remove('is-clipped');
    var modalEl = document.querySelector('#alert');
    modalEl.classList.remove('is-active')
};
// "close button" on modals will close them
document.querySelector(".modal-close").addEventListener("click", closeModalBtn);
// by clicking anywhere on page, mpdals will close aswell
document.querySelector(".modal-background").addEventListener("click", closeModalBtn);
// end Modals

// start address autocomplete(this is copied from Google documentation, and simplified)
function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (searchEl), {
        // options(from google documentation)
        types: ['geocode'],
        componentRestrictions: { country: "us" }
    })
};
// end address auto complete

// Start fetch user's IP (first API for our app, identifies the users exact location by IP address)
function initialLocation() {
    var IPapiKey = "602f8d85bc584bb4b0b520771a9d3287";
    var IPapi = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + IPapiKey;
    fetch(IPapi)
        .then((r) => r.json())
        .then((d) => {
            // assign user's lat/long to variables place them on the map
            searchLat = d.latitude;
            searchLng = d.longitude;
            initMap()
        });
}
initialLocation();
// End initial user's IP

// Start searchBar functioanlity
function searchBar(addressSearch) {
    // clear the places list
    document.getElementById("places-list").innerHTML = "";
    // use search value to transform it into lat/lng
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressSearch}&key=AIzaSyBtQgwtmt7aoZSZHJo2BT50rx2nqbZb8Tw`)
        .then(response => response.json())
        .then(data => {
            // save lat/lng into variables
            var userInputLat = data.results[0].geometry.location.lat;
            var userInputLng = data.results[0].geometry.location.lng;
            searchLat = userInputLat;
            searchLng = userInputLng;
            // display the results
            initMap()
        })
}
// End searchBar functioanlity

//local storage 
function history(input) {
        //check localStorage for previous searched address or create an array to store addresses in
    let searchedLoc = JSON.parse(localStorage.getItem('history')) || [];

    // check if a value is typed or if the value already exists
    if (!input || searchedLoc.includes(input)) {
        return
    } else {
        //push searched address into array
        searchedLoc.push(input);
        console.log(searchedLoc);

        //store array in local storage
        localStorage.setItem("history", JSON.stringify(searchedLoc));
    }

};

// Start render search history
function searchHistory() {
    //check localStorage for previous searched address or create an array to store addresses in
    let searchedLoc = JSON.parse(localStorage.getItem('history')) || [];
    for (let i = 0; i < searchedLoc.length; i++) {
        var newBtn = document.createElement("div");
        previousSearches.appendChild(newBtn);
        newBtn.classList = "panel-block button is-light is-large is-outlined is-fullwidth";
        newBtn.innerHTML = citiesArray[i];
        // call the function to use the address from btn
        newBtn.onclick = function (event) {
            var address = event.target.textContent;
            searchBar(address);
        }
    }
};
// End render search history

//function to run user button click data into variables and displays all options on page in a list
function getAll() {
    searchWord = searchEl.value;
    document.getElementById("places-list").innerHTML = "";
    initMap()
};

//function to run user button click data into variables and displays on page for groceries in a list
function getGroceries() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "store";
    initMap()
};

//function to run user button click data into variables and displays on page for churches in a list
function getChurches() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "church";
    initMap()
};

//function to run user button click data into variables and displays on page for schools in a list
function getSchools() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "school";
    initMap()
};
//function to run user button click data into variables and displays on page for hospitals in a list
function getHospitals() {
    document.getElementById("places-list").innerHTML = "";
    searchWord = "hospital";
    initMap()
};

// Start initialize the map
function initMap() {
    // Create the map.
    const searchedLocation = { lat: searchLat, lng: searchLng };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: searchedLocation,
        zoom: 15,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");
    moreButton.onclick = function () {
        moreButton.disabled = true;

        if (getNextPage) {
            getNextPage();
        }
    };

    // Perform a nearby search.
    service.nearbySearch({ location: searchedLocation, radius: 1500, type: searchWord },
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
    )
};
// End initialize the map

// Start search places and create the list
function addPlaces(places, map) {
    const placesDisplay = document.getElementById("places-list");
    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            const image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            new google.maps.Marker({
                map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });
            const placesListContainer = document.createElement("div");
            const placesList = document.createElement("div");
            const placesIcon = document.createElement("img");
            placesIcon.setAttribute("src", place.icon);
            placesListContainer.classList = "panel-block button is-light is-large is-outlined is-fullwidth";
            placesList.classList = "panel-block is-active  is-mobile ";
            placesList.textContent = place.name;
            placesDisplay.appendChild(placesListContainer);
            placesListContainer.appendChild(placesIcon);
            placesListContainer.appendChild(placesList);
            placesListContainer.addEventListener("click", () => {
                map.setCenter(place.geometry.location)
            })
        }
    }
};
// End search places and create the list

//button click and button data storage
searchBtnEl.onclick = function () {
    searchBar(searchEl.value);
    history(searchEl.value);
    searchEl.value = '';
};
allIdEl.onclick = function () { getAll() };
groceryIdEl.onclick = function () { getGroceries() };
churchIdEl.onclick = function () { getChurches() };
schoolIdEl.onclick = function () { getSchools() };
hospitalIdEl.onclick = function () { getHospitals() };