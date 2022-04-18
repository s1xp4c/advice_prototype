"use strict"

let URLvalue
let fieldValue
let monthly

// Get the inputform values
const inputForm = document.getElementById("siteinput");
inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    URLvalue = inputForm.elements.urlname.value;
    fieldValue = inputForm.elements.industryfield.value;
    monthly = inputForm.elements.monthlyvisitors.value;

    // STore values in local storage
    localStorage.setItem('URLvalue', URLvalue);
    localStorage.setItem('fieldValue', fieldValue);
    localStorage.setItem('monthly', monthly);

    // Change location after one second
    setTimeout(changeLocation, 1000)
});

function changeLocation() {
    location.href = `./carbonresult.html`;
}