"use strict"

let rangeSlider = document.getElementById("rs-range-line");
let rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
    rangeBullet.innerHTML = rangeSlider.value;
    let bulletPosition = (rangeSlider.value / rangeSlider.max);
    rangeBullet.style.left = (bulletPosition * 578) + "px";
}

// ToDo: Fetch Lighthouse score from lighthouseResult, categories, performance, score and multiply by 100
// Apply score to slider
// Do some CSS to make it seem like it's calculating and moving slider up to result

// LATER

// Apply scores to a form for database
// Fetch data from DB and apply to new sliders that can be moved