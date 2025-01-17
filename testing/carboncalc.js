"use strict";

const adviceAPIkey = "AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk";

const imageFromURL = new Image();

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
    unusedCSSCo2: "",

    unusedJStotalBytes: "",
    unusedJSwastedBytes: "",
    unusedJSwastedPercent: "",
    unusedJSCo2: "",

    unminCSStotalBytes: "",
    unminCSSwastedBytes: "",
    unminCSSwastedPercent: "",
    unminCSSCo2: "",

    unminJStotalBytes: "",
    unminJSwastedBytes: "",
    unminJSwastedPercent: "",
    unminJSCo2: "",

    modernImageFormatTotalBytes: "",
    modernImageFormatWastedBytes: "",
    modernImageFormatWastedPercent: "",
    modernImageFormatCo2: "",

    responsiveImagesTotalBytes: "",
    responsiveImagesWastedBytes: "",
    responsiveImagesWastedPercent: "",
    responsiveImagesCo2: "",

    optimizedImagesTotalBytes: "",
    optimizedImagesWastedBytes: "",
    optimizedImagesWastedPercent: "",
    optimizedImagesCo2: "",

    imageData: "",
    imageWidth: "",
    imageHeight: "",
}

let URLvalue
let fieldValue
let monthly
let errorValue = 1
const zero = 0

const DividerNumbers = {
    bytes: 1,
    kiloBytes: 1000,
    megaBytes: 1000000,
    gigaBytes: 1000000000,
}

const PowerDivider = {
    kiloWatt: 1,
    GigaWatt: 1000,
}

const Co2Divider = {
    grams: 1,
    kilos: 1000,
    ton: 1000000,
}

const NumberSuffix = {
    b: "b",
    kB: "kB",
    MB: "MB",
    GB: "GB",
}

const WeightSuffix = {
    g: "grams",
    kg: "kilos",
    t: "tons"
}

const PowerSuffix = {
    W: "Watt",
    kW: "kiloWatt",
    GW: "GigaWatt"
}

let divider
let numSuffix
let weightSuffix
let powerSuffix
let powerDivider
let co2Divider

const precisionPercent = 4

URLvalue = localStorage.getItem('URLvalue')
fieldValue = localStorage.getItem('fieldValue')
monthly = localStorage.getItem('monthly')
console.log(URLvalue, fieldValue, monthly)

if (monthly === "1") {
    divider = DividerNumbers.bytes
    numSuffix = NumberSuffix.b
    weightSuffix = WeightSuffix.g
    powerSuffix = PowerSuffix.kW
    co2Divider = Co2Divider.grams
    powerDivider = PowerDivider.Watt

} else if (monthly === "100") {
    divider = DividerNumbers.bytes
    numSuffix = NumberSuffix.b
    weightSuffix = WeightSuffix.g
    powerSuffix = PowerSuffix.kW
    co2Divider = Co2Divider.grams
    powerDivider = PowerDivider.Watt

} else if (monthly === "1000") {
    divider = DividerNumbers.kiloBytes
    numSuffix = NumberSuffix.kB
    weightSuffix = WeightSuffix.g
    powerSuffix = PowerSuffix.kW
    co2Divider = Co2Divider.grams
    powerDivider = PowerDivider.Watt

} else if (monthly === "10000") {
    divider = DividerNumbers.megaBytes
    numSuffix = NumberSuffix.MB
    weightSuffix = WeightSuffix.kg
    powerSuffix = PowerSuffix.kW
    co2Divider = Co2Divider.kilos
    powerDivider = PowerDivider.kiloWatt

} else if (monthly === "100000") {
    divider = DividerNumbers.megaBytes
    numSuffix = NumberSuffix.MB
    weightSuffix = WeightSuffix.kg
    powerSuffix = PowerSuffix.kW
    co2Divider = Co2Divider.kilos
    powerDivider = PowerDivider.kiloWatt

} else if (monthly === "1000000") {
    divider = DividerNumbers.gigaBytes
    numSuffix = NumberSuffix.GB
    weightSuffix = WeightSuffix.t
    powerSuffix = PowerSuffix.GW
    co2Divider = Co2Divider.ton
    powerDivider = PowerDivider.GigaWatt

}

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

    // Create object from template
    const siteInfo = Object.create(SiteInfo);

    // Web URL input
    siteInfo.webURL = data.lighthouseResult.finalUrl

    // Industry input
    siteInfo.fieldValue = fieldValue
        // Monthly users input
    siteInfo.monthly = monthly

    // Energyconsumption
    try {
        let energyUsed = co2Data.statistics.energy / powerDivider * monthly
        siteInfo.energyUsed = energyUsed.toFixed(2)
    } catch (error) {
        siteInfo.energyUsed = zero
    }
    try {
        let co2GridGrams = co2Data.statistics.co2.grid.grams / co2Divider * monthly
        siteInfo.co2GridGrams = co2GridGrams.toFixed(2)
    } catch (error) {
        siteInfo.co2GridGrams = zero
    }
    try {
        let co2RenewableGrams = co2Data.statistics.co2.renewable.grams / co2Divider * monthly
        siteInfo.co2RenewableGrams = co2RenewableGrams.toFixed(2)
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
        let unusedCSStotalBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].totalBytes / divider * monthly
        siteInfo.unusedCSStotalBytes = unusedCSStotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.unusedCSStotalBytes = zero
    }
    try {
        let unusedCSSwastedBytes = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedBytes / divider * monthly
        siteInfo.unusedCSSwastedBytes = unusedCSSwastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.unusedCSSwastedBytes = zero
    }
    try {
        siteInfo.unusedCSSwastedPercent = data.lighthouseResult.audits['unused-css-rules'].details.items[0].wastedPercent.toFixed(2)
    } catch (error) {
        siteInfo.unusedCSSwastedPercent = zero
    }

    // Unused Javascript
    try {
        let unusedJStotalBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].totalBytes / divider * monthly
        siteInfo.unusedJStotalBytes = unusedJStotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.unusedJStotalBytes = zero
    }
    try {
        let unusedJSwastedBytes = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedBytes / divider * monthly
        siteInfo.unusedJSwastedBytes = unusedJSwastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.unusedJSwastedBytes = zero
    }
    try {
        siteInfo.unusedJSwastedPercent = data.lighthouseResult.audits['unused-javascript'].details.items[0].wastedPercent.toFixed(2)
    } catch (error) {
        siteInfo.unusedJSwastedPercent = zero
    }

    // Unminified CSS
    try {
        let unminCSStotalBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].totalBytes / divider * monthly
        siteInfo.unminCSStotalBytes = unminCSStotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.unminCSStotalBytes = zero
    }
    try {
        let unminCSSwastedBytes = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedBytes / divider * monthly
        siteInfo.unminCSSwastedBytes = unminCSSwastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.unminCSSwastedBytes = zero
    }
    try {
        siteInfo.unminCSSwastedPercent = data.lighthouseResult.audits['unminified-css'].details.items[0].wastedPercent.toFixed(2)
    } catch (error) {
        siteInfo.unminCSSwastedPercent = zero
    }

    // Unminified Javascript
    try {
        let unminJStotalBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].totalBytes / divider * monthly
        siteInfo.unminJStotalBytes = unminJStotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.unminJStotalBytes = zero
    }
    try {
        let unminJSwastedBytes = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedBytes / divider * monthly
        siteInfo.unminJSwastedBytes = unminJSwastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.unminJSwastedBytes = zero
    }
    try {
        siteInfo.unminJSwastedPercent = data.lighthouseResult.audits['unminified-javascript'].details.items[0].wastedPercent.toFixed(2)
    } catch (error) {
        siteInfo.unminJSwastedPercent = zero
    }

    // Modern Image Format
    try {
        let modernImageFormatTotalBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].totalBytes / divider * monthly
        siteInfo.modernImageFormatTotalBytes = modernImageFormatTotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.modernImageFormatTotalBytes = zero
    }
    try {
        let modernImageFormatWastedBytes = data.lighthouseResult.audits["modern-image-formats"].details.items[0].wastedBytes / divider * monthly
        siteInfo.modernImageFormatWastedBytes = modernImageFormatWastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.modernImageFormatWastedBytes = zero
    }
    // Calc the percent here
    siteInfo.modernImageFormatWastedPercent = calcPercent(siteInfo.modernImageFormatTotalBytes, siteInfo.modernImageFormatWastedBytes).toFixed(2)
        // Responsive Images
    try {
        let responsiveImagesTotalBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].totalBytes / divider * monthly
        siteInfo.responsiveImagesTotalBytes = responsiveImagesTotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.responsiveImagesTotalBytes = zero
    }
    try {
        let responsiveImagesWastedBytes = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedBytes / divider * monthly
        siteInfo.responsiveImagesWastedBytes = responsiveImagesWastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.responsiveImagesWastedBytes = zero
    }
    try {
        siteInfo.responsiveImagesWastedPercent = data.lighthouseResult.audits["uses-responsive-images"].details.items[0].wastedPercent.toFixed(2)
    } catch (error) {
        siteInfo.responsiveImagesWastedPercent = zero
    }

    // Optimized Images
    try {
        let optimizedImagesTotalBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].totalBytes / divider * monthly
        siteInfo.optimizedImagesTotalBytes = optimizedImagesTotalBytes.toFixed(2)
    } catch (error) {
        siteInfo.optimizedImagesTotalBytes = zero
    }
    try {
        let optimizedImagesWastedBytes = data.lighthouseResult.audits["uses-optimized-images"].details.items[0].wastedBytes / divider * monthly
        siteInfo.optimizedImagesWastedBytes = optimizedImagesWastedBytes.toFixed(2)
    } catch (error) {
        siteInfo.optimizedImagesWastedBytes = zero
    }
    // Calc the percent here
    siteInfo.optimizedImagesWastedPercent = calcPercent(siteInfo.optimizedImagesTotalBytes, siteInfo.optimizedImagesWastedBytes).toFixed(2)

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
    document.querySelector("[data-field=energyUsed]").textContent = "Energy used: " + siteInfo.energyUsed + " " + powerSuffix
        // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGrams]").textContent = "CO2 for every new visitor: " + siteInfo.co2GridGrams + " " + weightSuffix
        // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGrams]").textContent = "CO2 that is renewable: " + siteInfo.co2RenewableGrams + " " + weightSuffix

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytes]").textContent = "Total: " + siteInfo.unusedCSStotalBytes + " " + numSuffix
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytes]").textContent = "Wasted: " + siteInfo.unusedCSSwastedBytes + " " + numSuffix
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercent]").textContent = "Wasted: " + siteInfo.unusedCSSwastedPercent + " %"

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytes]").textContent = "Total: " + siteInfo.unusedJStotalBytes + " " + numSuffix
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytes]").textContent = "Wasted: " + siteInfo.unusedJSwastedBytes + " " + numSuffix
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercent]").textContent = "Wasted: " + siteInfo.unusedJSwastedPercent + " %"

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytes]").textContent = "Total: " + siteInfo.unminCSStotalBytes + " " + numSuffix
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytes]").textContent = "Wasted: " + siteInfo.unminCSSwastedBytes + " " + numSuffix
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercent]").textContent = "Wasted: " + siteInfo.unminCSSwastedPercent + " %"

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytes]").textContent = "Total: " + siteInfo.unminJStotalBytes + " " + numSuffix
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytes]").textContent = "Wasted: " + siteInfo.unminJSwastedBytes + " " + numSuffix
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercent]").textContent = "Wasted: " + siteInfo.unminJSwastedPercent + " %"

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytes]").textContent = "Total: " + siteInfo.modernImageFormatTotalBytes + " " + numSuffix
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytes]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedBytes + " " + numSuffix
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercent]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %"

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytes]").textContent = "Total: " + siteInfo.responsiveImagesTotalBytes + " " + numSuffix
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytes]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedBytes + " " + numSuffix
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercent]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %"

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytes]").textContent = "Total: " + siteInfo.optimizedImagesTotalBytes + " " + numSuffix
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytes]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedBytes + " " + numSuffix
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
    document.querySelector("[data-field=unusedCSStotalBytesChange]").textContent = "Total: " + siteInfo.unusedCSStotalBytes + " " + numSuffix
        // unusedCSSwastedBytes: "",
    document.querySelector("[data-field=unusedCSSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unusedCSSwastedBytes + " " + numSuffix
        // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unusedCSSwastedPercent + " %"

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytesChange]").textContent = "Total: " + siteInfo.unusedJStotalBytes + " " + numSuffix
        // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unusedJSwastedBytes + " " + numSuffix
        // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unusedJSwastedPercent + " %"

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytesChange]").textContent = "Total: " + siteInfo.unminCSStotalBytes + " " + numSuffix
        // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unminCSSwastedBytes + " " + numSuffix
        // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unminCSSwastedPercent + " %"

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytesChange]").textContent = "Total: " + siteInfo.unminJStotalBytes + " " + numSuffix
        // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytesChange]").textContent = "Wasted: " + siteInfo.unminJSwastedBytes + " " + numSuffix
        // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercentChange]").textContent = "Wasted: " + siteInfo.unminJSwastedPercent + " %"

    // modernImageFormatTotalBytes: "",
    document.querySelector("[data-field=modernImageFormatTotalBytesChange]").textContent = "Total: " + siteInfo.modernImageFormatTotalBytes + " " + numSuffix
        // modernImageFormatWastedBytes: "",
    document.querySelector("[data-field=modernImageFormatWastedBytesChange]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedBytes + " " + numSuffix
        // modernImageFormatWastedPercent: "",
    document.querySelector("[data-field=modernImageFormatWastedPercentChange]").textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %"

    // responsiveImagesTotalBytes: "",
    document.querySelector("[data-field=responsiveImagesTotalBytesChange]").textContent = "Total: " + siteInfo.responsiveImagesTotalBytes + " " + numSuffix
        // responsiveImagesWastedBytes: "",
    document.querySelector("[data-field=responsiveImagesWastedBytesChange]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedBytes + " " + numSuffix
        // responsiveImagesWastedPercent: "",
    document.querySelector("[data-field=responsiveImagesWastedPercentChange]").textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %"

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytesChange]").textContent = "Total: " + siteInfo.optimizedImagesTotalBytes + " " + numSuffix
        // optimizedImagesWastedBytes: "",
    document.querySelector("[data-field=optimizedImagesWastedBytesChange]").textContent = "Wasted: " + siteInfo.optimizedImagesWastedBytes + " " + numSuffix
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