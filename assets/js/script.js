// start sample modal
var sampleModal = function() {
    var htmlEl = document.querySelector('html');
    var modalEl = document.querySelector('.modal');
    modalEl.classList.add('is-active');
    htmlEl.classList.add('is-clipped');
};

var closeModalBtn = function() {
    var htmlEl = document.querySelector('html');
    var modalEl = document.querySelector('.modal');
    modalEl.classList.remove('is-active');
    htmlEl.classList.remove('is-clipped');
}

document.getElementById('search').addEventListener('click',sampleModal);
document.querySelector('.modal-close').addEventListener('click', closeModalBtn);
document.querySelector('.modal-background').addEventListener('click', closeModalBtn);
// end sample modal


// fetch IP of user
    var IPapiKey = "602f8d85bc584bb4b0b520771a9d3287";
    var IPapi = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + IPapiKey;
    
    // make a get request to url
    fetch(IPapi).then(function (response) {

        response.json().then(function (data) {
         
// fetch HERE API results based on search term or button
            var apiKey = "i1hSXQkDrhsUByspfzk0sf_CHLOMrDlOaMwjc5GGIK4";
            var searchPlace = "schools";
            var api = "https://places.ls.hereapi.com/places/v1/discover/search?apiKey=" + apiKey + "&at=" + data.latitude + "," + data.longitude + "&q=" + searchPlace + "&pretty"
            console.log(api)
            // make a get request to url
            fetch(api).then(function (response) {
        
                response.json().then(function (data) {
                    console.log(data.results.items[0].title)
                })
            })

        })
    })