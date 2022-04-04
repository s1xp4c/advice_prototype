"use strict"

const adviceAPIkey = 'AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk'
const inputForm = document.getElementById("siteinput");

const SiteInfo = {
    myURL: "",
    timestamp: "",
    performance: "",
    overall: "",
    percentile: "",
}

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let URLvalue = inputForm.elements.urlname.value;
    calcMyCarbon(URLvalue);
})

async function calcMyCarbon(URLvalue) {
    await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "cache-control": "no-cache"
            }
        })
        .then(response => response.json())
        // .then(data => prepData(data))
        .then(response => {
            console.log(response);
            prepData(response);
        })
        .catch(err => {
            console.error(err);
        });

}

let infos

function prepData(data) {
    infos = data.map(fillInfo)
    buildInfoList()
}

function fillInfo(data) {
    const siteInfo = Object.create(SiteInfo)

    siteInfo.myURL = data.lighthouseResult.finalUrl
    siteInfo.timestamp = data.lighthouseResult.fetchTime
    siteInfo.performance = data.lighthouseResult.categories.performance.score
    siteInfo.overall = data.lighthouseResult.overall_category
    siteInfo.percentile = data.lighthouseResult.timing

    console.log(siteInfo)
    return siteInfo
}

function buildInfoList() {
    document.querySelector(".siteinfo tbody.siteinfo__table--tbody").innerHTML = ""
    infos.forEach(displayInfoList)
}

function displayInfoList(siteInfo) {

    const siteInfoClone = document.querySelector("template#aboutinfo").content.cloneNode(true)

    siteInfoClone.querySelector("[data-field=timestamp]").textContent = siteInfo.timestamp
    siteInfoClone.querySelector("[data-field=website]").textContent = siteInfo.myURL
    siteInfoClone.querySelector("[data-field=performance]").textContent = siteInfo.performance
    siteInfoClone.querySelector("[data-field=overall]").textContent = siteInfo.overall
    siteInfoClone.querySelector("[data-field=percentile]").textContent = siteInfo.percentile

    document.querySelector(".siteinfo tbody.siteinfo__table--tbody").appendChild(siteInfoClone)
}