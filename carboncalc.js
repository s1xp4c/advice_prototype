"use strict";



const adviceAPIkey = "AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk";
// const inputForm = document.getElementById("siteinput");

const imageFromURL = new Image();
//  let URLvalue = JSON.parse(localStorage.URLvalue || null) || {};
// let fieldValue

const SiteInfo = {
    webURL: "",
    fetchtime: "",
    fieldValue: "",
    monthly: "",

    energyUsed: "",

    co2GridGrams: "",
    co2RenewableGrams: "",

    unusedCSStotalBytes: "",
    unusedCSSwastedBytes: "",
    unusedCSSwastedPercent: "",

    unusedJStotalBytes: "",
    unusedJSwastedBytes: "",
    unusedJSwastedPercent: "",

    unminCSStotalBytes: "",
    unminCSSwastedBytes: "",
    unminCSSwastedPercent: "",

    unminJStotalBytes: "",
    unminJSwastedBytes: "",
    unminJSwastedPercent: "",

    modernImageFormatTotalBytes: "",
    modernImageFormatWastedBytes: "",
    modernImageFormatWastedPercent: "",

    responsiveImagesTotalBytes: "",
    responsiveImagesWastedBytes: "",
    responsiveImagesWastedPercent: "",

    optimizedImagesTotalBytes: "",
    optimizedImagesWastedBytes: "",
    optimizedImagesWastedPercent: "",

    imageData: "",
    imageWidth: "",
    imageHeight: "",
}

let URLvalue
let fieldValue
let monthly

URLvalue = localStorage.getItem('URLvalue')
fieldValue = localStorage.getItem('fieldValue')
monthly = localStorage.getItem('monthly')
console.log(URLvalue, fieldValue, monthly)

calcMyCarbon(URLvalue)

async function calcMyCarbon() {

    console.log("Calc running")
    await fetch(
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
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
    // calcMyCo2(URLvalue);
}

// async function calcMyCo2(URLvalue) {
//     await fetch(`https://kea-alt-del.dk/websitecarbon/site/?url=${URLvalue}`, {
//             method: "GET",
//         })
//         .then((response) => response.json())
//         .then((data1) => {
//             console.log(data1);
//             prepData(data1);

//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }

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

// function prepDataco2(data1) {
//     fillInfo(data1);
// }

function fillInfo(data) {
    const siteInfo = Object.create(SiteInfo);

    siteInfo.webURL = data.lighthouseResult.finalUrl
    siteInfo.fetchtime = data.lighthouseResult.fetchTime
    siteInfo.fieldValue = fieldValue
    siteInfo.monthly = monthly

    // siteInfo.energyUsed = data1.statistics.energy
    // siteInfo.co2GridGrams = data1.statistics.co2.grid.grams
    // siteInfo.co2RenewableGrams = data1.statistics.co2.renewable.grams


    // Unused CSS rules
    try {
        siteInfo.unusedCSStotalBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].totalBytes
    } catch (error) {
        siteInfo.unusedCSStotalBytes = 0
    }
    try {
        siteInfo.unusedCSSwastedBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.unusedCSSwastedBytes = 0
    }
    try {
        siteInfo.unusedCSSwastedPercent = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedPercent
    } catch (error) {
        siteInfo.unusedCSSwastedPercent = 0
    }

    // Unused Javascript
    try {
        siteInfo.unusedJStotalBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].totalBytes
    } catch (error) {
        siteInfo.unusedJStotalBytes = 0
    }
    try {
        siteInfo.unusedJSwastedBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.unusedJSwastedBytes = 0
    }
    try {
        siteInfo.unusedJSwastedPercent = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedPercent
    } catch (error) {
        siteInfo.unusedJSwastedPercent = 0
    }

    // Unminified CSS
    try {
        siteInfo.unminCSStotalBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].totalBytes
    } catch (error) {
        siteInfo.unminCSStotalBytes = 0
    }
    try {
        siteInfo.unminCSSwastedBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.unminCSSwastedBytes = 0
    }
    try {
        siteInfo.unminCSSwastedPercent = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedPercent
    } catch (error) {
        siteInfo.unminCSSwastedPercent = 0
    }

    // Unminified Javascript
    try {
        siteInfo.unminJStotalBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].totalBytes
    } catch (error) {
        siteInfo.unminJStotalBytes = 0
    }
    try {
        siteInfo.unminJSwastedBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.unminJSwastedBytes = 0
    }
    try {
        siteInfo.unminJSwastedPercent = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedPercent
    } catch (error) {
        siteInfo.unminJSwastedPercent = 0
    }

    // Modern Image Format
    try {
        siteInfo.modernImageFormatTotalBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].totalBytes
    } catch (error) {
        siteInfo.modernImageFormatTotalBytes = 0
    }
    try {
        siteInfo.modernImageFormatWastedBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.modernImageFormatWastedBytes = 0
    }
    // Calc the percent here

    // Responsive Images
    try {
        siteInfo.responsiveImagesTotalBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].totalBytes
    } catch (error) {
        siteInfo.responsiveImagesTotalBytes = 0
    }
    try {
        siteInfo.responsiveImagesWastedBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.responsiveImagesWastedBytes = 0
    }
    try {
        siteInfo.responsiveImagesWastedPercent = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedPercent
    } catch (error) {
        siteInfo.responsiveImagesWastedPercent = 0
    }

    // Optimized Images
    try {
        siteInfo.optimizedImagesStotalBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].totalBytes
    } catch (error) {
        siteInfo.optimizedImagesStotalBytes = 0
    }
    try {
        siteInfo.optimizedImagesSwastedBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].wastedBytes
    } catch (error) {
        siteInfo.optimizedImagesSwastedBytes = 0
    }
    // Calc percent here

    // Image data
    siteInfo.imageData = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.data
    siteInfo.imageWidth = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.width
    siteInfo.imageHeight = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.height

    console.log(siteInfo)
    displayInfoList(siteInfo)

}
let splashWidth
let splashHeight

function displayInfoList(siteInfo) {

    document.querySelector("[data-field=fetchtime]").textContent = siteInfo.fetchtime
    document.querySelector("[data-field=weburl]").textContent = siteInfo.webURL
    document.querySelector("[data-field=fieldValue]").textContent = siteInfo.fieldValue
    document.querySelector("[data-field=monthly]").textContent = siteInfo.monthly + " Monthly visitors"

    // energyUsed: "",
    document.querySelector("[data-field=energyUsed]").textContent = siteInfo.energyUsed
        // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGrams]").textContent = siteInfo.co2GridGrams
        // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGrams]").textContent = siteInfo.co2RenewableGrams

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytes]").textContent = siteInfo.unusedCSStotalBytes
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytes]").textContent = siteInfo.unusedCSSwastedBytes
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercent]").textContent = siteInfo.unusedCSSwastedPercent

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytes]").textContent = siteInfo.unusedJStotalBytes
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytes]").textContent = siteInfo.unusedJSwastedBytes
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercent]").textContent = siteInfo.unusedJSwastedPercent

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytes]").textContent = siteInfo.unminCSStotalBytes
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytes]").textContent = siteInfo.unminCSSwastedBytes
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercent]").textContent = siteInfo.unminCSSwastedPercent

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytes]").textContent = siteInfo.unminJStotalBytes
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytes]").textContent = siteInfo.unminJSwastedBytes
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercent]").textContent = siteInfo.unminJSwastedPercent

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytes]").textContent = siteInfo.modernImageFormatTotalBytes
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytes]").textContent = siteInfo.modernImageFormatWastedBytes
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercent]").textContent = siteInfo.modernImageFormatWastedPercent

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytes]").textContent = siteInfo.responsiveImagesTotalBytes
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytes]").textContent = siteInfo.responsiveImagesWastedBytes
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercent]").textContent = siteInfo.responsiveImagesWastedPercent

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytes]").textContent = siteInfo.optimizedImagesTotalBytes
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytes]").textContent = siteInfo.optimizedImagesWastedBytes
        // optimizedImagesWastedPercent: "",
    document.querySelector("[data-field=optimizedImagesWastedPercent]").textContent = siteInfo.optimizedImagesWastedPercent



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
        ) / 100;
    }

})