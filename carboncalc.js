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

function calcMyCarbon(URLvalue) {
    fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            "method": "GET",
            "headers": {}
        })
        .then(data => data.json())
        .then(response => {
            console.log(response);
        })
        .then(data => prepData(data))
        .catch(err => {
            console.error(err);
        });

}

let infos

function prepData(data) {
    infos = data.map(fillInfo)
    buildInfoList()
}

function fillInfo() {
    const siteInfo = Object.create(SiteInfo)

    siteInfo.myURL = data.id
    siteInfo.timestamp = data.analysisUTCTimestamp
    siteInfo.performance = data.performance
    siteInfo.overall = data.overall_category
    siteInfo.percentile = data.timing

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