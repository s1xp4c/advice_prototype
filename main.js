"use strict"

// import { calcMyCarbon } from './carboncalc'
// import './rangeslider'
const inputForm = document.getElementById("siteinput");
let URLvalue
let fieldValue
inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    URLvalue = inputForm.elements.urlname.value;
    fieldValue = inputForm.elements.industryfield.value;
    localStorage.setItem('URLvalue', URLvalue);

    setTimeout(changeLocation, 1000)
        // changeLocation();

    // calcMyCo2(URLvalue);
});

function changeLocation() {
    location.href = `carbonresult.html`;

}