"use strict";

const adviceAPIkey = "AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk";
const inputForm = document.getElementById("siteinput");

const SiteInfo = {
  myURL: "",
  timestamp: "",
  performance: "",
  overall: "",
  percentile: "",
};
let URLvalue = inputForm.elements.urlname.value;
inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let URLvalue = inputForm.elements.urlname.value;
  calcMyCarbon(URLvalue);
  calcMyCo2(URLvalue);
});

async function calcMyCarbon(URLvalue) {
  await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "cache-control": "no-cache",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
  
      prepData(data);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function calcMyCo2(URLvalue) {
  await fetch(`https://kea-alt-del.dk/websitecarbon/site/?url=${URLvalue}`)
    .then((response) => response.json())
    .then((data1) => {
      console.log(data1);
        prepData(data1);
    
    })
    .catch((err) => {
      console.error(err);
    });
}

// async function start() {
//   const promise1 = await calcMyCo2(URLvalue);
//   const promise2 = await calcMyCarbon(URLvalue);
//   Promise.all([promise1, promise2]).then((value) => {
//     console.log(value);
//     prepData(value);
//   });
// }
// start();

function prepData(data) {
  fillInfo(data);
}
function prepDataco2(data1) {
  fillInfo(data1);
}

function fillInfo(data) {
  const siteInfo = Object.create(SiteInfo);

  siteInfo.myURL = data.lighthouseResult.finalUrl;
  siteInfo.timestamp = data.lighthouseResult.fetchTime;
  siteInfo.performance = data.lighthouseResult.categories.performance.score;
  siteInfo.overall = data.loadingExperience.overall_category;
  siteInfo.percentile = data.lighthouseResult.timing.total;

  console.log(siteInfo);
  displayInfoList(siteInfo);
}

function displayInfoList(siteInfo) {
  document.querySelector("[data-field=timestamp]").textContent =
    siteInfo.timestamp;
  document.querySelector("[data-field=website]").textContent = siteInfo.myURL;
  document.querySelector("[data-field=performance]").textContent =
    siteInfo.performance;
  document.querySelector("[data-field=overall]").textContent = siteInfo.overall;
  document.querySelector("[data-field=percentile]").textContent =
    siteInfo.percentile;
}
