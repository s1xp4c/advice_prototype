"use strict";

// let rangeSlider = document.getElementById("rs-range-line");
// let rangeBullet = document.getElementById("rs-bullet");

// rangeSlider.addEventListener("input", showSliderValue, false);

// function showSliderValue() {
//   rangeBullet.innerHTML = rangeSlider.value;
//   let bulletPosition = rangeSlider.value / rangeSlider.max;
//   rangeBullet.style.left = bulletPosition * 578 + "px";
// }

// ToDo: Fetch Lighthouse score from lighthouseResult, categories, performance, score and multiply by 100
// Apply score to slider
// Do some CSS to make it seem like it's calculating and moving slider up to result

// LATER

// Apply scores to a form for database
// Fetch data from DB and apply to new sliders that can be moved
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });

  //setting bubble on DOM load
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;

  const min = range.min || 0;
  const max = range.max || 100;
  //   rangeSlider.value / rangeSlider.max

  const offset = Number(((val - min) * 100) / (max - min));

  bubble.textContent = val;

  bubble.style.left = `calc(${offset}% - 14px)`;
}

document.addEventListener("DOMContentLoaded", () => {
  let slider = document.getElementById("interact");
  console.log(slider);
  slider.addEventListener("change", () => {
    console.log("Changed Input");
  });
});
