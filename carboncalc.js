"use strict"

const adviceAPIkey = 'AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk'
const inputForm = document.getElementById("siteinput");
const imageFromURL = new Image();

const SiteInfo = {
    myURL: "",
    timestamp: "",
    performance: "",
    overall: "",
    percentile: "",
    imageData: "",
    imageWidth: "",
    imageHeight: "",
}

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let URLvalue = inputForm.elements.urlname.value;
    calcMyCarbon(URLvalue);
})

async function calcMyCarbon(URLvalue) {
    await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "cache-control": "no-cache"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            prepData(data);
        })
        .catch(err => {
            console.error(err);
        });
}

function prepData(data) {
    fillInfo(data)
}

function fillInfo(data) {
    const siteInfo = Object.create(SiteInfo)

    siteInfo.myURL = data.lighthouseResult.finalUrl
    siteInfo.timestamp = data.lighthouseResult.fetchTime
    siteInfo.performance = data.lighthouseResult.categories.performance.score
    siteInfo.overall = data.loadingExperience.overall_category
    siteInfo.percentile = data.lighthouseResult.timing.total
    siteInfo.imageData = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.data
    siteInfo.imageWidth = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.width
    siteInfo.imageHeight = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.height

    console.log(siteInfo)
    displayInfoList(siteInfo)

}
let splashWidth
let splashHeight

function displayInfoList(siteInfo) {

    document.querySelector("[data-field=timestamp]").textContent = siteInfo.timestamp
    document.querySelector("[data-field=website]").textContent = siteInfo.myURL
    document.querySelector("[data-field=performance]").textContent = siteInfo.performance
    document.querySelector("[data-field=overall]").textContent = siteInfo.overall
    document.querySelector("[data-field=percentile]").textContent = siteInfo.percentile
    imageFromURL.src = siteInfo.imageData
    splashWidth = siteInfo.imageWidth / 3
    splashHeight = siteInfo.imageHeight / 3
}

imageFromURL.addEventListener('load', function() {


    const splashCanvas = document.getElementById('imgFromURL');
    const splashCTX = splashCanvas.getContext('2d');

    // splashWidth = document.getElementById('imgDiv').offsetWidth;
    // splashHeight = document.getElementById('imgDiv').offsetHeight;

    splashCanvas.width = splashWidth;
    splashCanvas.height = splashHeight;

    splashCTX.drawImage(imageFromURL, 0, 0, splashCanvas.width, splashCanvas.height);
    const pixels = splashCTX.getImageData(0, 0, splashCanvas.width, splashCanvas.height);

    let mappedImage = [];
    let cellBrightness = [];

    for (let y = 0; y < splashCanvas.height; y++) {
        let row = [];
        for (let x = 0; x < splashCanvas.width; x++) {
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calculateRelativeBrightness(red, green, blue);

            const cell = [
                cellBrightness = brightness,
            ];
            row.push(cell);
        }
        mappedImage.push(row);
    }

    function calculateRelativeBrightness(red, green, blue) {
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        ) / 10;
    }

})