function getGoogleMaps() {


    fetch("https://maps.googleapis.com/maps/api/js?key=AIzaSyBtQgwtmt7aoZSZHJo2BT50rx2nqbZb8Tw&callback=initMap")
        .then(response => response.json())
        .then(data => console.log(data));
}
getGoogleMaps();