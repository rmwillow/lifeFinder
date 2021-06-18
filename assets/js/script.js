// start Modals
    // alert modal will replace any default alerts
var alertModal = function () {
    // select the page and disables the scroll by adding respective classes(from framework)
    var htmlEl = document.querySelector('html');
    htmlEl.classList.add('is-clipped');
// select modal div and render on page(styles are from framework)
    var modalEl = document.querySelector('#alert');
    modalEl.classList.add('is-active');
};
    // close modals by removing the respective classes
var closeModalBtn = function () {
    var htmlEl = document.querySelector('html');
    htmlEl.classList.remove('is-clipped');
    var modalEl = document.querySelector('#alert');
    modalEl.classList.remove('is-active');
};
// "close button" on modals will close them
document.querySelector(".modal-close").addEventListener("click", closeModalBtn);
// by clicking anywhere on page, mpdals will close aswell
document.querySelector(".modal-background").addEventListener("click", closeModalBtn);
// end Modals

// start address autocomplete(this is copied from Google documentation, and simplified)
var autocomplete;
var searchEl = document.getElementById('autocomplete');

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(searchEl),
        {
            // options(from google documentation)
            types: ['geocode'],
            componentRestrictions: { country: "us" }
        }
    );
    // When the user selects an address from the dropdown, Call any function instead of Modal, Modal is for testing purposes;
    // autocomplete.addListener('place_changed', sampleModal); 
};
// end address auto complete

// fetch IP of user
var IPapiKey = "602f8d85bc584bb4b0b520771a9d3287";
var IPapi = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + IPapiKey;
fetch(IPapi)
  .then((r) => r.json())
  .then((d) => console.log(d.latitude, d.longitude));
// end of IP of user fetch


//api call functions


//google places api START

// selects the schools button filter
var schoolsEl = document.getElementById("schools");

schoolsEl.addEventListener("click", () => {
  searchWord = "school";
  initMap();
});


// variables for lat and longitude from user entered address will replace the numbers below
let userInputLat = 30.2672;
let userInputLng = -97.7431;

let searchLat = userInputLat;
let searchLng = userInputLng;

function initMap() {
  // Create the map.
  const searchedLocation = { lat: searchLat, lng: searchLng };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: searchedLocation,
    zoom: 17,
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
  service.nearbySearch(
    { location: searchedLocation, radius: 500, type: searchWord },
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
      const li = document.createElement("div");
      li.classList = "panel-block is-active";
      li.textContent = place.name;
      placesList.appendChild(li);
      li.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
      });
    }
  }
}


