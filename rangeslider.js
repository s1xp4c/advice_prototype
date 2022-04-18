"use strict";

// ToDo: Fetch Lighthouse score from lighthouseResult, categories, performance, score and multiply by 100
// Apply score to slider
// Do some CSS to make it seem like it's calculating and moving slider up to result

// LATER

// Apply scores to a form for database
// Fetch data from DB and apply to new sliders that can be moved

let bubble;
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  let bubble = wrap.querySelector(".bubble");

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

const NumberSuffix = {
  b: "b",
  kB: "kB",
  MB: "MB",
  GB: "GB",
};
let numSuffix;
const divider = 100;
document.addEventListener("DOMContentLoaded", () => {
  let sliders = document.getElementsByClassName("range");
  console.log(sliders[0]);
  let changedvalue;

  for (let i = 0; i < sliders.length; i++) {
    let elem = sliders[i];
    elem.addEventListener("change", () => {
      let sliderValue = elem.value;
      let toChangeDiv = elem.parentNode.parentNode;
      let pElems = toChangeDiv.getElementsByTagName("p");
      for (let j = 0; j < pElems.length; j++) {
        let pelem = pElems[j];
        if (pelem.hasAttribute("data-field")) {
          let changedAttribute = pelem.getAttribute("data-field");
          let originalAttribute = changedAttribute.replace("Change", "");
          console.log("Original Attribute is", originalAttribute);
          let originalElem = document.querySelectorAll(
            `[data-field="${originalAttribute}"]`
          )[0];
          let value = originalElem.innerText;

          //let originalValue = value.split(":")[1].split(" ")[1];
          let originalValue = window.SiteInfo[originalAttribute];
          let changedvalue = (originalValue / 100) * sliderValue;
          console.log(pelem.innerText);
          if (!value.includes("%")) {
            let updatedText = value.replace(
              originalValue,
              changedvalue.toFixed(2)
            );

            pelem.innerText = updatedText;
          } else {
            let updatedText = value.replace(originalValue, sliderValue);
            pelem.innerText = updatedText;
          }
        }
      }
    });
  }
  let checkBoxes = document.querySelectorAll(".check-checkbox");
  for (let j = 0; j < checkBoxes.length; j++) {
    let toggleElement = checkBoxes[j];
    toggleElement.addEventListener("change", () => {
      let elem = toggleElement;
      let toChangeDiv = elem.parentNode.parentNode.parentNode;
      let pElems = toChangeDiv.getElementsByTagName("p");
      console.log(pElems, toChangeDiv);
      for (let k = 0; k < pElems.length; k++) {
        let pelem = pElems[k];

        if (pelem.hasAttribute("data-field")) {
          let text = pelem.innerText;
          let attributeKey = pelem.getAttribute("data-field");
          attributeKey = attributeKey.replace("Change", "");
          // console.log("attribute is ", attributeKey);
          // if (text.includes("0")) {
          //   // pelem.innerText = pelem.innerText.replace(
          //   //   "0",
          //   //   window.SiteInfo[attributeKey]
          //   // );
          // } else {
          //   let toReplace = pelem.innerText.split(": ")[1].replace(" ")[0];
          //   console.log(toReplace, pelem.innerText);
          //   pelem.innerText = pelem.innerText.replace(toReplace, "0");
          // }
          if (toggleElement.checked) {
            let toReplace = pelem.innerText.split(": ")[1].split(" ")[0];
            console.log("original ", pelem.innerText);

            console.log(toReplace);
            pelem.innerText = pelem.innerText.replace(toReplace, "0");
          } else {
            let toReplace = pelem.innerText.split(": ")[1].split(" ")[0];
            let originalValue = SiteInfo[attributeKey];
            
            pelem.innerText = pelem.innerText.replace(toReplace, originalValue);
          }
        }
      }
    });
  }
});
