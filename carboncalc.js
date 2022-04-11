"use strict";



const adviceAPIkey = "AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk";
// const inputForm = document.getElementById("siteinput");

const imageFromURL = new Image();
//  let URLvalue = JSON.parse(localStorage.URLvalue || null) || {};
// let fieldValue

const ReturnVisitors = {
    visitURL: "",
    visitDate: "",
}

const SiteInfo = {
    webURL: "",
    fetchtime: "",
    fetchdate: "",
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
let errorValue = 1
const zero = 0

const bytes = 1
const kiloBytes = 1000
const megaBytes = 1000000
const divider = kiloBytes

URLvalue = localStorage.getItem('URLvalue')
fieldValue = localStorage.getItem('fieldValue')
monthly = localStorage.getItem('monthly')
console.log(URLvalue, fieldValue, monthly)

async function calcLighthouseAndCo2() {
    // const co2Promise = await fetch(`https://api.websitecarbon.com/site?url=${URLvalue}`, {
    //         method: "GET",
    //         mode: "no-cors",
    //         headers: {
    //             "Content-Type": "application/json; charset=utf-8",
    //             "cache-control": "no-cache",
    //             'Access-Control-Allow-Origin': "http://localhost:3000",
    //         },
    //     })
    const co2Promise = await fetch(`https://kea-alt-del.dk/websitecarbon/site/?url=${URLvalue}`, {
        method: "GET",
    })
    const lighthousePromise = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "cache-control": "no-cache",
            },
        })
    Promise.all([co2Promise, lighthousePromise]).then(valueArray => {
        return Promise.all(valueArray.map(r => r.json()))

    }).then(([co2Data, lighthouseData]) => {
        console.log(co2Data, lighthouseData)
        fillInfo(co2Data, lighthouseData)
    }).catch((e) => {
        console.log(errorValue)
        errorValue++
        if (errorValue <= 5) {
            calcLighthouseAndCo2()
        } else {
            alert("The carbon fetch request has failed!! - Please try again later or input another site")
        }
        console.log(e);
    });
}

calcLighthouseAndCo2();

function fillInfo(co2Data, data) {


    const siteInfo = Object.create(SiteInfo);

    // Web URL input
    siteInfo.webURL = data.lighthouseResult.finalUrl

    // Industry input
    siteInfo.fieldValue = fieldValue
        // Monthly users input
    siteInfo.monthly = monthly

    // Energyconsumption
    try {
        siteInfo.energyUsed = co2Data.statistics.energy
    } catch (error) {
        siteInfo.energyUsed = zero
    }
    try {
        siteInfo.co2GridGrams = co2Data.statistics.co2.grid.grams
    } catch (error) {
        siteInfo.co2GridGrams = zero
    }
    try {
        siteInfo.co2RenewableGrams = co2Data.statistics.co2.renewable.grams
    } catch (error) {
        siteInfo.co2RenewableGrams = zero
    }

    // Slice out Date from papgespeed 
    let fullDateAndTime = data.analysisUTCTimestamp
    let timeDataT = fullDateAndTime.indexOf('T')
    let slicedDate = fullDateAndTime.substr(0, timeDataT)

    siteInfo.fetchdate = slicedDate

    // Time calculation
    let timestamp = co2Data.timestamp
    siteInfo.fetchtime = timeCalc(timestamp)

    // Unused CSS rules
    try {
        siteInfo.unusedCSStotalBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unusedCSStotalBytes = zero
    }
    try {
        siteInfo.unusedCSSwastedBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unusedCSSwastedBytes = zero
    }
    try {
        siteInfo.unusedCSSwastedPercent = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedPercent.toPrecision(4)
    } catch (error) {
        siteInfo.unusedCSSwastedPercent = zero
    }

    // Unused Javascript
    try {
        siteInfo.unusedJStotalBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unusedJStotalBytes = zero
    }
    try {
        siteInfo.unusedJSwastedBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unusedJSwastedBytes = zero
    }
    try {
        siteInfo.unusedJSwastedPercent = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedPercent.toPrecision(4)
    } catch (error) {
        siteInfo.unusedJSwastedPercent = zero
    }

    // Unminified CSS
    try {
        siteInfo.unminCSStotalBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unminCSStotalBytes = zero
    }
    try {
        siteInfo.unminCSSwastedBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unminCSSwastedBytes = zero
    }
    try {
        siteInfo.unminCSSwastedPercent = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedPercent.toPrecision(4)
    } catch (error) {
        siteInfo.unminCSSwastedPercent = zero
    }

    // Unminified Javascript
    try {
        siteInfo.unminJStotalBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unminJStotalBytes = zero
    }
    try {
        siteInfo.unminJSwastedBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.unminJSwastedBytes = zero
    }
    try {
        siteInfo.unminJSwastedPercent = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedPercent.toPrecision(4)
    } catch (error) {
        siteInfo.unminJSwastedPercent = zero
    }

    // Modern Image Format
    try {
        siteInfo.modernImageFormatTotalBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.modernImageFormatTotalBytes = zero
    }
    try {
        siteInfo.modernImageFormatWastedBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.modernImageFormatWastedBytes = zero
    }
    // Calc the percent here
    siteInfo.modernImageFormatWastedPercent = calcPercent(siteInfo.modernImageFormatTotalBytes, siteInfo.modernImageFormatWastedBytes).toPrecision(4)

    // Responsive Images
    try {
        siteInfo.responsiveImagesTotalBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.responsiveImagesTotalBytes = zero
    }
    try {
        siteInfo.responsiveImagesWastedBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.responsiveImagesWastedBytes = zero
    }
    try {
        siteInfo.responsiveImagesWastedPercent = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedPercent.toPrecision(4)
    } catch (error) {
        siteInfo.responsiveImagesWastedPercent = zero
    }

    // Optimized Images
    try {
        siteInfo.optimizedImagesTotalBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].totalBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.optimizedImagesTotalBytes = zero
    }
    try {
        siteInfo.optimizedImagesWastedBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].wastedBytes.toPrecision(4) / divider
    } catch (error) {
        siteInfo.optimizedImagesWastedBytes = zero
    }
    // Calc the percent here
    siteInfo.optimizedImagesWastedPercent = calcPercent(siteInfo.optimizedImagesTotalBytes, siteInfo.optimizedImagesWastedBytes).toPrecision(4)

    // Image data
    siteInfo.imageData = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.data
    siteInfo.imageWidth = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.width
    siteInfo.imageHeight = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.height

    console.log(siteInfo)
    displayInfoList(siteInfo)
    changeInfoList(siteInfo)
}

function timeCalc(timestamp) {
    let date = new Date(timestamp * 1000)
    let hours = date.getHours()
    let minutes = '0' + date.getMinutes()
    let seconds = '0' + date.getSeconds()
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    return formattedTime
}

function calcPercent(total, wasted) {
    let wastedPercent
    if (total === 0) {
        return wastedPercent = zero
    }
    wastedPercent = 100 / total * wasted
    return wastedPercent
}

let splashWidth
let splashHeight

function displayInfoList(siteInfo) {

    document.querySelector("[data-field=fetchtime]").textContent = "Time: " + siteInfo.fetchtime
    document.querySelector("[data-field=fetchdate]").textContent = "Date: " + siteInfo.fetchdate
    document.querySelector("[data-field=weburl]").textContent = " " + siteInfo.webURL
    document.querySelector("[data-field=fieldValue]").textContent = "Field of industry: " + siteInfo.fieldValue
    document.querySelector("[data-field=monthly]").textContent = "Monthly visitors: " + siteInfo.monthly

    // energyUsed: "",
    document.querySelector("[data-field=energyUsed]").textContent = "Energy used: " + siteInfo.energyUsed + " kW"
        // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGrams]").textContent = "CO2 for every new visitor: " + siteInfo.co2GridGrams + " g"
        // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGrams]").textContent = "CO2 that is renewable: " + siteInfo.co2RenewableGrams + " g"

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytes]").textContent = "Total: " + siteInfo.unusedCSStotalBytes + " kB"
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytes]").textContent = "Wasted: " + siteInfo.unusedCSSwastedBytes + " kB"
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercent]").textContent = "Wasted: " + siteInfo.unusedCSSwastedPercent + " %"

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytes]").textContent = "Total: " + siteInfo.unusedJStotalBytes + " kB"
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytes]").textContent = "Wasted: " + siteInfo.unusedJSwastedBytes + " kB"
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercent]").textContent = "Wasted: " + siteInfo.unusedJSwastedPercent + " %"

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytes]").textContent = "Total: " + siteInfo.unminCSStotalBytes + " kB"
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytes]").textContent = "Wasted: " + siteInfo.unminCSSwastedBytes + " kB"
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercent]").textContent = "Wasted: " + siteInfo.unminCSSwastedPercent + " %"

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytes]").textContent = "Total: " + siteInfo.unminJStotalBytes + " kB"
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytes]").textContent = "Wasted: " + siteInfo.unminJSwastedBytes + " kB"
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercent]").textContent = "Wasted: " + siteInfo.unminJSwastedPercent + " %"

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytes]").textContent = "Total: " + siteInfo.modernImageFormatTotalBytes + " kB"
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytes]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedBytes + " kB"
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercent]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %"

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytes]").textContent = "Total: " + siteInfo.responsiveImagesTotalBytes + " kB"
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytes]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedBytes + " kB"
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercent]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %"

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytes]").textContent = "Total: " + siteInfo.optimizedImagesTotalBytes + " kB"
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytes]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedBytes + " kB"
        // optimizedImagesWastedPercent: "",
    document.querySelector("[data-field=optimizedImagesWastedPercent]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedPercent + " %"

    // Image data
    imageFromURL.src = siteInfo.imageData
    splashWidth = siteInfo.imageWidth / 3
    splashHeight = siteInfo.imageHeight / 3
}

function changeInfoList(siteInfo) {

    // energyUsed: "",
    // document.querySelector("[data-field=energyUsedChange]").textContent = siteInfo.energyUsed + " kW"
    //     // co2GridGrams: "",
    // document.querySelector("[data-field=co2GridGramsChange]").textContent = siteInfo.co2GridGrams + " g"
    //     // co2RenewableGrams: "",
    // document.querySelector("[data-field=co2RenewableGramsChange]").textContent = siteInfo.co2RenewableGrams + " g"

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytesChange]").textContent = "Total: " + siteInfo.unusedCSStotalBytes + " kB"
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unusedCSSwastedBytes + " kB"
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unusedCSSwastedPercent + " %"

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytesChange]").textContent = "Total: " + siteInfo.unusedJStotalBytes + " kB"
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unusedJSwastedBytes + " kB"
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unusedJSwastedPercent + " %"

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytesChange]").textContent = "Total: " + siteInfo.unminCSStotalBytes + " kB"
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unminCSSwastedBytes + " kB"
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unminCSSwastedPercent + " %"

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytesChange]").textContent = "Total: " + siteInfo.unminJStotalBytes + " kB"
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unminJSwastedBytes + " kB"
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unminJSwastedPercent + " %"

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytesChange]").textContent = "Total: " + siteInfo.modernImageFormatTotalBytes + " kB"
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytesChange]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedBytes + " kB"
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercentChange]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %"

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytesChange]").textContent = "Total: " + siteInfo.responsiveImagesTotalBytes + " kB"
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytesChange]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedBytes + " kB"
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercentChange]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %"

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytesChange]").textContent = "Total: " + siteInfo.optimizedImagesTotalBytes + " kB"
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytesChange]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedBytes + " kB"
        // optimizedImagesWastedPercent: "",
    document.querySelector("[data-field=optimizedImagesWastedPercentChange]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedPercent + " %"

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


    endLoadingAnimation();

})

function endLoadingAnimation() {
    let loader = document.getElementById("loader");
    loader.classList.add("hide");
}