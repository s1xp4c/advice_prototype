"use strict";


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
  //getting all the sliders
  let sliders = document.getElementsByClassName("range");
  console.log(sliders[0]);
  let changedvalue;
//adding "change" eventlistener to each slides
  for (let i = 0; i < sliders.length; i++) {
    let elem = sliders[i];
    elem.addEventListener("change", () => {
      let sliderValue = elem.value;
      let toChangeDiv = elem.parentNode.parentNode;
      let pElems = toChangeDiv.getElementsByTagName("p");
      //grtting all ta para from the parentNode of the sliders
      for (let j = 0; j < pElems.length; j++) {
        let pelem = pElems[j];
        if (pelem.hasAttribute("data-field")) {
         
          //extracting Attribute Data_field from each of the para element
          let changedAttribute = pelem.getAttribute("data-field");
          //removing "change"
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
      //getting the paragraphs from parentNode
      let toChangeDiv = elem.parentNode.parentNode.parentNode;
      let pElems = toChangeDiv.getElementsByTagName("p");
      console.log(pElems, toChangeDiv);
      for (let k = 0; k < pElems.length; k++) {
        let pelem = pElems[k];
        //extracting Attribute Data-filed from each of the para element

        if (pelem.hasAttribute("data-field")) {
          let text = pelem.innerText;
          let attributeKey = pelem.getAttribute("data-field");
          //removing "change" from the Attribute so that we can query original value from SiteInfo
          attributeKey = attributeKey.replace("Change", "");


          //if toggle checked replace the data with 0 else with original siteInfo value
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
