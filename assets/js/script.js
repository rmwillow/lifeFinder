<<<<<<< HEAD
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
=======
document.getElementById("searchSubmit").onclick = function() { myFunction() };

function myFunction() {
    var inputVal = document.getElementById("searchHomes").value;
    console.log(inputVal);
}

//api call functions

//zillow api



//google places api

//google maps api
>>>>>>> develop
