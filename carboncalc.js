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
        console.log(co2Data)
        console.log(lighthouseData)
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
        siteInfo.energyUsed = 0
    }
    try {
        siteInfo.co2GridGrams = co2Data.statistics.co2.grid.grams
    } catch (error) {
        siteInfo.co2GridGrams = 0
    }
    try {
        siteInfo.co2RenewableGrams = co2Data.statistics.co2.renewable.grams
    } catch (error) {
        siteInfo.co2RenewableGrams = 0
    }

    // Time calculation
    let timestamp = co2Data.timestamp
    siteInfo.fetchtime = timeCalc(timestamp)

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
    let modernTotalBytes = siteInfo.modernImageFormatTotalBytes
    let modernWastedBytes = siteInfo.modernImageFormatWastedBytes
    siteInfo.modernImageFormatWastedPercent = calcPercent(modernTotalBytes, modernWastedBytes)

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
    // Calc the percent here
    let optimizedTotalBytes = siteInfo.optimizedImagesStotalBytes
    let optimizedWastedBytes = siteInfo.optimizedImagesSwastedBytes
    siteInfo.optimizedImagesWastedPercent = calcPercent(optimizedTotalBytes, optimizedWastedBytes)

    // Image data
    siteInfo.imageData = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.data
    siteInfo.imageWidth = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.width
    siteInfo.imageHeight = data.lighthouseResult.audits['full-page-screenshot'].details.screenshot.height

    console.log(siteInfo)
    displayInfoList(siteInfo)

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
        return wastedPercent = 0
    }
    wastedPercent = 100 / total * wasted
    return wastedPercent
}

let splashWidth
let splashHeight

function displayInfoList(siteInfo) {

    document.querySelector("[data-field=fetchtime]").textContent = siteInfo.fetchtime
    document.querySelector("[data-field=weburl]").textContent = siteInfo.webURL
    document.querySelector("[data-field=fieldValue]").textContent = "Field of industry: " + siteInfo.fieldValue
    document.querySelector("[data-field=monthly]").textContent = siteInfo.monthly + " Monthly visitors"

    // energyUsed: "",
    document.querySelector("[data-field=energyUsed]").textContent = siteInfo.energyUsed + " kW"
        // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGrams]").textContent = siteInfo.co2GridGrams + " g"
        // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGrams]").textContent = siteInfo.co2RenewableGrams + " g"

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytes]").textContent = siteInfo.unusedCSStotalBytes + " bytes"
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytes]").textContent = siteInfo.unusedCSSwastedBytes + " bytes"
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercent]").textContent = siteInfo.unusedCSSwastedPercent + " %"

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytes]").textContent = siteInfo.unusedJStotalBytes + " bytes"
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytes]").textContent = siteInfo.unusedJSwastedBytes + " bytes"
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercent]").textContent = siteInfo.unusedJSwastedPercent + " %"

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytes]").textContent = siteInfo.unminCSStotalBytes + " bytes"
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytes]").textContent = siteInfo.unminCSSwastedBytes + " bytes"
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercent]").textContent = siteInfo.unminCSSwastedPercent + " %"

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytes]").textContent = siteInfo.unminJStotalBytes + " bytes"
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytes]").textContent = siteInfo.unminJSwastedBytes + " bytes"
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercent]").textContent = siteInfo.unminJSwastedPercent + " %"

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytes]").textContent = siteInfo.modernImageFormatTotalBytes + " bytes"
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytes]").textContent = siteInfo.modernImageFormatWastedBytes + " bytes"
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercent]").textContent = siteInfo.modernImageFormatWastedPercent + " %"

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytes]").textContent = siteInfo.responsiveImagesTotalBytes + " bytes"
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytes]").textContent = siteInfo.responsiveImagesWastedBytes + " bytes"
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercent]").textContent = siteInfo.responsiveImagesWastedPercent + " %"

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytes]").textContent = siteInfo.optimizedImagesTotalBytes + " bytes"
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytes]").textContent = siteInfo.optimizedImagesWastedBytes + " bytes"
        // optimizedImagesWastedPercent: "",
    document.querySelector("[data-field=optimizedImagesWastedPercent]").textContent = siteInfo.optimizedImagesWastedPercent + " %"



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


    endLoadingAnimation();

})

function endLoadingAnimation() {
    let loader = document.getElementById("loader");
    loader.classList.add("hide");
}