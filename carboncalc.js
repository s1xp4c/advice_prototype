"use strict";
import { stringifyJSON } from "./push.js";
import { sendEmail } from "./sendme";

const adviceAPIkey = "AIzaSyA3T3lU6NyXFlEjJMt739iXmn-GBT_B7qk";

// Make a new image to fill with incoming screenshot data
const imageFromURL = new Image();

// Make object to push to database
export const SiteInfo = {
    webURL: "",

    isItGreen: false,
    cleanerThan: "",

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
};

let URLvalue;
let fieldValue;
let monthly;
let errorValue = 1;
const zero = 0;
let calculatedCo2FromBytes;

// Actual Co2 per byte from co2 estimater site
const co2PerByte = 6.0286198277026768025957908932939e-7;

// Make divider numbers if suffix is changed because of large numbers
const DividerNumbers = {
    bytes: 1,
    kiloBytes: 1000,
    megaBytes: 1000000,
    gigaBytes: 1000000000,
};

const PowerDivider = {
    kiloWatt: 1,
    GigaWatt: 1000,
};

const Co2Divider = {
    grams: 1,
    kilos: 1000,
    ton: 1000000,
};

const NumberSuffix = {
    b: "b",
    kB: "kB",
    MB: "MB",
    GB: "GB",
};

const WeightSuffix = {
    g: "g",
    kg: "kg",
    t: "t",
};

const PowerSuffix = {
    W: "Watt",
    kW: "kiloWatt",
    GW: "GigaWatt",
};

let divider;
let numSuffix;
let weightSuffix;
let powerSuffix;
let powerDivider;
let co2Divider;

const precisionPercent = 4;

// Get values from local storage
URLvalue = localStorage.getItem("URLvalue");
fieldValue = localStorage.getItem("fieldValue");
monthly = localStorage.getItem("monthly");
console.log(URLvalue, fieldValue, monthly);

// change suffixes and divider numbers on monthly users change
if (monthly === "1") {
    divider = DividerNumbers.bytes;
    numSuffix = NumberSuffix.b;
    weightSuffix = WeightSuffix.g;
    powerSuffix = PowerSuffix.kW;
    co2Divider = Co2Divider.grams;
    powerDivider = PowerDivider.Watt;
} else if (monthly === "100") {
    divider = DividerNumbers.bytes;
    numSuffix = NumberSuffix.b;
    weightSuffix = WeightSuffix.g;
    powerSuffix = PowerSuffix.kW;
    co2Divider = Co2Divider.grams;
    powerDivider = PowerDivider.Watt;
} else if (monthly === "1000") {
    divider = DividerNumbers.kiloBytes;
    numSuffix = NumberSuffix.kB;
    weightSuffix = WeightSuffix.kg;
    powerSuffix = PowerSuffix.kW;
    co2Divider = Co2Divider.kilos;
    powerDivider = PowerDivider.kiloWatt;
} else if (monthly === "10000") {
    divider = DividerNumbers.megaBytes;
    numSuffix = NumberSuffix.MB;
    weightSuffix = WeightSuffix.kg;
    powerSuffix = PowerSuffix.kW;
    co2Divider = Co2Divider.kilos;
    powerDivider = PowerDivider.kiloWatt;
} else if (monthly === "100000") {
    divider = DividerNumbers.megaBytes;
    numSuffix = NumberSuffix.MB;
    weightSuffix = WeightSuffix.kg;
    powerSuffix = PowerSuffix.kW;
    co2Divider = Co2Divider.kilos;
    powerDivider = PowerDivider.kiloWatt;
} else if (monthly === "1000000") {
    divider = DividerNumbers.gigaBytes;
    numSuffix = NumberSuffix.GB;
    weightSuffix = WeightSuffix.t;
    powerSuffix = PowerSuffix.GW;
    co2Divider = Co2Divider.ton;
    powerDivider = PowerDivider.GigaWatt;
}

const okAlertBox = document.getElementById("alertBox");

async function calcLighthouseAndCo2() {
    // Outcommented working fetchcode from original API in case kea-alt-del doesn't work in the future

    // const co2Promise = await fetch(`https://api.websitecarbon.com/site?url=${URLvalue}`, {
    //         method: "GET",
    //         mode: "no-cors",
    //         headers: {
    //             "Content-Type": "application/json; charset=utf-8",
    //             "cache-control": "no-cache",
    //             'Access-Control-Allow-Origin': "http://localhost:3000",
    //         },
    //     })

    // Make a promise to fetch website carbon
    const co2Promise = await fetch(
        `https://kea-alt-del.dk/websitecarbon/site/?url=${URLvalue}`, {
            method: "GET",
        }
    );

    // Make a promise to fetch pagespeed numbers
    const lighthousePromise = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URLvalue}&key=${adviceAPIkey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "cache-control": "no-cache",
            },
        }
    );
    // Run all promises and spit out the two arrays
    Promise.all([co2Promise, lighthousePromise])
        .then((valueArray) => {
            return Promise.all(valueArray.map((r) => r.json()));
        })
        // Then forward the two arrays to be sorted by fillInfo
        .then(([co2Data, lighthouseData]) => {
            console.log(co2Data, lighthouseData);
            fillInfo(co2Data, lighthouseData);
        })
        // Sometimes pagespeed fails on the first couple of tries, so rerun fetch. 
        // On more than 5 fails - return the error popup and end loading animation
        .catch((e) => {
            console.log(errorValue);
            errorValue++;
            if (errorValue <= 5) {
                calcLighthouseAndCo2();
            } else {
                console.log("fail alert");
                okAlertBox.classList.remove("hide");
                endLoadingAnimation();
            }
            console.log(e);
        });
}

// Run the fetch promises
calcLighthouseAndCo2();

export function fillInfo(co2Data, data) {
    // Create object from template
    const siteInfo = Object.create(SiteInfo);

    // Is it green
    if (co2Data.green === "unknown") {
        siteInfo.isItGreen = "unknown";
    } else {
        siteInfo.isItGreen = co2Data.green;
    }

    // Is cleaner than
    siteInfo.cleanerThan = co2Data.cleanerThan * 100;

    // Web URL input
    siteInfo.webURL = data.lighthouseResult.finalUrl;

    // Industry input
    // variabel to uppercase the first letter. 
    const fieldValueUppercase = fieldValue.charAt(0).toUpperCase() + fieldValue.substring(1).toLowerCase();

    // Variabel to replace the dash from the data filld name
    const dashRemoved = fieldValueUppercase.replace(/-/g, ' ');
    console.log(dashRemoved);

    siteInfo.fieldValue = dashRemoved;

    // Monthly users input
    siteInfo.monthly = monthly;

    // Not all websites are the same and therefore som numbers will exist on some sites and not on others.
    // Therefore it runs a try and catch error on each numbers to see if it exist, and outputs "0" if it doesn't

    // Energyconsumption
    try {
        let energyUsed = co2Data.statistics.energy * monthly;
        siteInfo.energyUsed = energyUsed.toFixed(2);
    } catch (error) {
        siteInfo.energyUsed = zero;
    }
    try {
        let co2GridGrams =
            (co2Data.statistics.co2.grid.grams / co2Divider) * monthly;
        siteInfo.co2GridGrams = co2GridGrams.toFixed(2);
    } catch (error) {
        siteInfo.co2GridGrams = zero;
    }
    try {
        let co2RenewableGrams =
            (co2Data.statistics.co2.renewable.grams / co2Divider) * monthly;
        siteInfo.co2RenewableGrams = co2RenewableGrams.toFixed(2);
    } catch (error) {
        siteInfo.co2RenewableGrams = zero;
    }

    // Slice out Date from papgespeed
    let fullDateAndTime = data.analysisUTCTimestamp;
    let timeDataT = fullDateAndTime.indexOf("T");
    let slicedDate = fullDateAndTime.substr(0, timeDataT);

    siteInfo.fetchdate = slicedDate;

    // Time calculation
    let timestamp = co2Data.timestamp;
    siteInfo.fetchtime = timeCalc(timestamp);

    // Unused CSS rules
    try {
        let unusedCSStotalBytes =
            (data.lighthouseResult.audits["unused-css-rules"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.unusedCSStotalBytes = unusedCSStotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.unusedCSStotalBytes = zero;
    }
    try {
        let unusedCSSwastedBytes =
            (data.lighthouseResult.audits["unused-css-rules"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.unusedCSSwastedBytes = unusedCSSwastedBytes.toFixed(2);
        siteInfo.unusedCSSCo2 = calcCo2FromBytes(unusedCSSwastedBytes).toFixed(2);
    } catch (error) {
        siteInfo.unusedCSSwastedBytes = zero;
        siteInfo.unusedCSSCo2 = zero;
    }
    try {
        siteInfo.unusedCSSwastedPercent =
            data.lighthouseResult.audits[
                "unused-css-rules"
            ].details.items[0].wastedPercent.toFixed(2);
    } catch (error) {
        siteInfo.unusedCSSwastedPercent = zero;
    }

    // Unused Javascript
    try {
        let unusedJStotalBytes =
            (data.lighthouseResult.audits["unused-javascript"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.unusedJStotalBytes = unusedJStotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.unusedJStotalBytes = zero;
    }
    try {
        let unusedJSwastedBytes =
            (data.lighthouseResult.audits["unused-javascript"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.unusedJSwastedBytes = unusedJSwastedBytes.toFixed(2);
        siteInfo.unusedJSCo2 = calcCo2FromBytes(unusedJSwastedBytes).toFixed(2);
    } catch (error) {
        siteInfo.unusedJSwastedBytes = zero;
        siteInfo.unusedJSCo2 = zero;
    }
    try {
        siteInfo.unusedJSwastedPercent =
            data.lighthouseResult.audits[
                "unused-javascript"
            ].details.items[0].wastedPercent.toFixed(2);
    } catch (error) {
        siteInfo.unusedJSwastedPercent = zero;
    }

    // Unminified CSS
    try {
        let unminCSStotalBytes =
            (data.lighthouseResult.audits["unminified-css"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.unminCSStotalBytes = unminCSStotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.unminCSStotalBytes = zero;
    }
    try {
        let unminCSSwastedBytes =
            (data.lighthouseResult.audits["unminified-css"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.unminCSSwastedBytes = unminCSSwastedBytes.toFixed(2);
        siteInfo.unminCSSCo2 = calcCo2FromBytes(unminCSSwastedBytes).toFixed(2);
    } catch (error) {
        siteInfo.unminCSSwastedBytes = zero;
        siteInfo.unminCSSCo2 = zero;
    }
    try {
        siteInfo.unminCSSwastedPercent =
            data.lighthouseResult.audits[
                "unminified-css"
            ].details.items[0].wastedPercent.toFixed(2);
    } catch (error) {
        siteInfo.unminCSSwastedPercent = zero;
    }

    // Unminified Javascript
    try {
        let unminJStotalBytes =
            (data.lighthouseResult.audits["unminified-javascript"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.unminJStotalBytes = unminJStotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.unminJStotalBytes = zero;
    }
    try {
        let unminJSwastedBytes =
            (data.lighthouseResult.audits["unminified-javascript"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.unminJSwastedBytes = unminJSwastedBytes.toFixed(2);
        siteInfo.unminJSCo2 = calcCo2FromBytes(unminJSwastedBytes).toFixed(2);
    } catch (error) {
        siteInfo.unminJSwastedBytes = zero;
        siteInfo.unminJSCo2 = zero;
    }
    try {
        siteInfo.unminJSwastedPercent =
            data.lighthouseResult.audits[
                "unminified-javascript"
            ].details.items[0].wastedPercent.toFixed(2);
    } catch (error) {
        siteInfo.unminJSwastedPercent = zero;
    }

    // Modern Image Format
    try {
        let modernImageFormatTotalBytes =
            (data.lighthouseResult.audits["modern-image-formats"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.modernImageFormatTotalBytes =
            modernImageFormatTotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.modernImageFormatTotalBytes = zero;
    }
    try {
        let modernImageFormatWastedBytes =
            (data.lighthouseResult.audits["modern-image-formats"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.modernImageFormatWastedBytes =
            modernImageFormatWastedBytes.toFixed(2);
        siteInfo.modernImageFormatCo2 = calcCo2FromBytes(
            modernImageFormatWastedBytes
        ).toFixed(2);
    } catch (error) {
        siteInfo.modernImageFormatWastedBytes = zero;
        siteInfo.modernImageFormatCo2 = zero;
    }
    // Calc the percent here
    siteInfo.modernImageFormatWastedPercent = calcPercent(
        siteInfo.modernImageFormatTotalBytes,
        siteInfo.modernImageFormatWastedBytes
    ).toFixed(2);
    // Responsive Images
    try {
        let responsiveImagesTotalBytes =
            (data.lighthouseResult.audits["uses-responsive-images"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.responsiveImagesTotalBytes = responsiveImagesTotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.responsiveImagesTotalBytes = zero;
    }
    try {
        let responsiveImagesWastedBytes =
            (data.lighthouseResult.audits["uses-responsive-images"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.responsiveImagesWastedBytes =
            responsiveImagesWastedBytes.toFixed(2);
        siteInfo.responsiveImagesCo2 = calcCo2FromBytes(
            responsiveImagesWastedBytes
        ).toFixed(2);
    } catch (error) {
        siteInfo.responsiveImagesWastedBytes = zero;
        siteInfo.responsiveImagesCo2 = zero;
    }
    try {
        siteInfo.responsiveImagesWastedPercent =
            data.lighthouseResult.audits[
                "uses-responsive-images"
            ].details.items[0].wastedPercent.toFixed(2);
    } catch (error) {
        siteInfo.responsiveImagesWastedPercent = zero;
    }

    // Optimized Images
    try {
        let optimizedImagesTotalBytes =
            (data.lighthouseResult.audits["uses-optimized-images"].details.items[0]
                .totalBytes /
                divider) *
            monthly;
        siteInfo.optimizedImagesTotalBytes = optimizedImagesTotalBytes.toFixed(2);
    } catch (error) {
        siteInfo.optimizedImagesTotalBytes = zero;
    }
    try {
        let optimizedImagesWastedBytes =
            (data.lighthouseResult.audits["uses-optimized-images"].details.items[0]
                .wastedBytes /
                divider) *
            monthly;
        siteInfo.optimizedImagesWastedBytes = optimizedImagesWastedBytes.toFixed(2);
        siteInfo.optimizedImagesCo2 = calcCo2FromBytes(
            optimizedImagesWastedBytes
        ).toFixed(2);
    } catch (error) {
        siteInfo.optimizedImagesWastedBytes = zero;
        siteInfo.optimizedImagesCo2 = zero;
    }
    // Calc the percent here
    siteInfo.optimizedImagesWastedPercent = calcPercent(
        siteInfo.optimizedImagesTotalBytes,
        siteInfo.optimizedImagesWastedBytes
    ).toFixed(2);

    // Image data
    siteInfo.imageData =
        data.lighthouseResult.audits[
            "full-page-screenshot"
        ].details.screenshot.data;
    siteInfo.imageWidth =
        data.lighthouseResult.audits[
            "full-page-screenshot"
        ].details.screenshot.width;
    siteInfo.imageHeight =
        data.lighthouseResult.audits[
            "full-page-screenshot"
        ].details.screenshot.height;

    console.log(siteInfo);
    window.SiteInfo = siteInfo;

    // Instead of running 2 different functions here, we could have appended child to each instead
    displayInfoList(siteInfo);
    changeInfoList(siteInfo);

    // stringifyJSON(siteInfo)
    checkBoxCheckedOrNot(siteInfo);
}

// Check to see if users checked to push data to database
function checkBoxCheckedOrNot(siteInfo) {
    console.log("check checkbooox");

    const sendFormSubmit = document.getElementById("result_form");
    sendFormSubmit.addEventListener("submit", (e) => {
        sendEmail()
        e.preventDefault();
        if (document.getElementById("yes").checked === true) {
            stringifyJSON(siteInfo);
        } else {
            console.log("not checked");
        }

        // Clear form on submit
        sendFormSubmit.reset();
    });
}

// Calculate Co2 used * monthly users
function calcCo2FromBytes(bytes) {
    let bytesTimesDivider = bytes * divider;
    calculatedCo2FromBytes = bytesTimesDivider * co2PerByte;
    return calculatedCo2FromBytes;
}

// Calculate time from timestamp (The timestamp is sometimes from where the backend server is placed in the world)
function timeCalc(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return formattedTime;
}

// Calculate how much percent is wasted compared to the total number
function calcPercent(total, wasted) {
    let wastedPercent;
    if (total === 0) {
        return (wastedPercent = zero);
    }
    wastedPercent = (100 / total) * wasted;
    return wastedPercent;
}

// Make variables to input screenshot size into
let splashWidth;
let splashHeight;

// Display the data on the calc site
function displayInfoList(siteInfo) {
    // Fetch time
    document.querySelector("[data-field=fetchtime]").textContent =
        "Time: " + siteInfo.fetchtime;

    // isItGreen:
    if (siteInfo.isItGreen) {
        document.querySelector("[data-field=isItGreen]").textContent =
            "Site is: Green";
    } else if (siteInfo.isItGreen === "unknown") {
        document.querySelector("[data-field=isItGreen]").textContent =
            "Site green status is: Unknown";
    } else {
        document.querySelector("[data-field=isItGreen]").textContent =
            "Site is: NOT green";
    }

    // cleanerThan: "",
    document.querySelector("[data-field=cleanerThan]").textContent =
        "Cleaner than: " + siteInfo.cleanerThan + " %";

    // Fetch date
    document.querySelector("[data-field=fetchdate]").textContent =
        "Date: " + siteInfo.fetchdate;

    // WebURL input
    document.querySelector("[data-field=weburl]").textContent =
        " " + siteInfo.webURL;

    // Industry Field value
    document.querySelector("[data-field=fieldValue]").textContent =
        "Field of industry: " + siteInfo.fieldValue;

    // Monthly
    document.querySelector("[data-field=monthly]").textContent =
        "Monthly visitors: " + siteInfo.monthly;

    // energyUsed: "",
    document.querySelector("[data-field=energyUsed]").textContent =
        "Energy used: " + siteInfo.energyUsed + " " + powerSuffix;
    // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGrams]").textContent =
        "CO2 total: " + siteInfo.co2GridGrams + " " + weightSuffix;
    // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGrams]").textContent =
        "CO2 renewable: " + siteInfo.co2RenewableGrams + " " + weightSuffix;

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytes]").textContent =
        "Total: " + siteInfo.unusedCSStotalBytes + " " + numSuffix;
    let bubbles = document.getElementsByClassName("bubble");

    bubbles[0].setAttribute(
        "style",
        `left: calc(${siteInfo.unusedCSSwastedPercent}% - 14px);`
    );

    bubbles[0].innerText = siteInfo.unusedCSSwastedPercent
        .toString()
        .split(".")[0];

    document.querySelector("[data-field=unusedCSSwastedBytes]").textContent =
        "Wasted: " + siteInfo.unusedCSSwastedBytes + " " + numSuffix;
    // unusedCSSwastedPercent: "",
    document.querySelector("[data-field=unusedCSSwastedPercent]").textContent =
        "Wasted: " + siteInfo.unusedCSSwastedPercent + " %";
    // unusedCSSCo2: "",
    document.querySelector("[data-field=unusedCSSCo2]").textContent =
        "CO2 wasted: " + siteInfo.unusedCSSCo2 + " g";
    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytes]").textContent =
        "Total: " + siteInfo.unusedJStotalBytes + " " + numSuffix;
    // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytes]").textContent =
        "Wasted: " + siteInfo.unusedJSwastedBytes + " " + numSuffix;
    // unusedJSwastedPercent: "",
    document.querySelector("[data-field=unusedJSwastedPercent]").textContent =
        "Wasted: " + siteInfo.unusedJSwastedPercent + " %";
    //setting the bubble value in the slider to siteInfo value when page is loaded    
    bubbles[1].setAttribute(
        "style",
        `left: calc(${siteInfo.unusedJSwastedPercent}% - 14px);`
    );
    //the number inside the bubble is set to be wasted percentage value
    bubbles[1].innerText = siteInfo.unusedJSwastedPercent
        .toString()
        .split(".")[0];

    // unusedJSCo2: "",
    document.querySelector("[data-field=unusedJSCo2]").textContent =
        "CO2 wasted: " + siteInfo.unusedJSCo2 + " g";

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytes]").textContent =
        "Total: " + siteInfo.unminCSStotalBytes + " " + numSuffix;
    // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytes]").textContent =
        "Wasted: " + siteInfo.unminCSSwastedBytes + " " + numSuffix;
    // unminCSSwastedPercent: "",
    document.querySelector("[data-field=unminCSSwastedPercent]").textContent =
        "Wasted: " + siteInfo.unminCSSwastedPercent + " %";
    if (siteInfo.unminCSSwastedPercent == 0) {
        document.querySelector("#unminCSStoggle").checked = true;
        document.querySelector("#unminCSStoggle").disabled = true;
    }
    // unminCSSCo2: "",
    document.querySelector("[data-field=unminCSSCo2]").textContent =
        "CO2 wasted: " + siteInfo.unminCSSCo2 + " g";

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytes]").textContent =
        "Total: " + siteInfo.unminJStotalBytes + " " + numSuffix;
    // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytes]").textContent =
        "Wasted: " + siteInfo.unminJSwastedBytes + " " + numSuffix;
    // unminJSwastedPercent: "",
    document.querySelector("[data-field=unminJSwastedPercent]").textContent =
        "Wasted: " + siteInfo.unminJSwastedPercent + " %";
    if (siteInfo.unminJSwastedPercent == 0) {
        document.querySelector("#unminJStoggle").checked = true;
        document.querySelector("#unminJStoggle").disabled = true;
    }
    // unminJSCo2: "",
    document.querySelector("[data-field=unminJSCo2]").textContent =
        "CO2 wasted: " + siteInfo.unminJSCo2 + " g";

    // modernImageFormatTotalBytes: "",
    document.querySelector(
            "[data-field=modernImageFormatTotalBytes]"
        ).textContent =
        "Total: " + siteInfo.modernImageFormatTotalBytes + " " + numSuffix;
    // modernImageFormatWastedBytes: "",
    document.querySelector(
            "[data-field=modernImageFormatWastedBytes]"
        ).textContent =
        "Wasted: " + siteInfo.modernImageFormatWastedBytes + " " + numSuffix;
    // modernImageFormatWastedPercent: "",
    document.querySelector(
        "[data-field=modernImageFormatWastedPercent]"
    ).textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %";
    //setting the bubble value in the slider to siteInfo value when page is loaded    

    bubbles[2].setAttribute(
        "style",
        `left: calc(${siteInfo.modernImageFormatWastedPercent}% - 14px);`
    );
    //the number inside the bubble is set to be wasted percentage value

    bubbles[2].innerText = siteInfo.modernImageFormatWastedPercent
        .toString()
        .split(".")[0];

    // modernImageFormatCo2: "",
    document.querySelector("[data-field=modernImageFormatCo2]").textContent =
        "CO2 wasted: " + siteInfo.modernImageFormatCo2 + " g";

    // responsiveImagesTotalBytes: "",
    document.querySelector(
            "[data-field=responsiveImagesTotalBytes]"
        ).textContent =
        "Total: " + siteInfo.responsiveImagesTotalBytes + " " + numSuffix;
    // responsiveImagesWastedBytes: "",
    document.querySelector(
            "[data-field=responsiveImagesWastedBytes]"
        ).textContent =
        "Wasted: " + siteInfo.responsiveImagesWastedBytes + " " + numSuffix;
    // responsiveImagesWastedPercent: "",
    document.querySelector(
        "[data-field=responsiveImagesWastedPercent]"
    ).textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %";
    //setting the bubble value in the slider to siteInfo value when page is loaded    

    bubbles[3].setAttribute(
        "style",
        `left: calc(${siteInfo.responsiveImagesWastedPercent}% - 14px);`
    );
    //the number inside the bubble is set to be wasted percentage value
    bubbles[3].innerText = siteInfo.responsiveImagesWastedPercent
        .toString()
        .split(".")[0];

    // responsiveImagesCo2: "",
    document.querySelector("[data-field=responsiveImagesCo2]").textContent =
        "CO2 wasted: " + siteInfo.responsiveImagesCo2 + " g";

    // optimizedImagesTotalBytes: "",
    document.querySelector("[data-field=optimizedImagesTotalBytes]").textContent =
        "Total: " + siteInfo.optimizedImagesTotalBytes + " " + numSuffix;
    // optimizedImagesWastedBytes: "",
    document.querySelector(
            "[data-field=optimizedImagesWastedBytes]"
        ).textContent =
        "Wasted: " + siteInfo.optimizedImagesWastedBytes + " " + numSuffix;
    // optimizedImagesWastedPercent: "",
    document.querySelector(
        "[data-field=optimizedImagesWastedPercent]"
    ).textContent = "Wasted: " + siteInfo.optimizedImagesWastedPercent + " %";
    //setting the bubble value in the slider to siteInfo value when page is loaded    

    bubbles[4].setAttribute(
        "style",
        `left: calc(${siteInfo.optimizedImagesWastedPercent}% - 14px);`
    );
    //the number inside the bubble is set to be wasted percentage value

    bubbles[4].innerText = siteInfo.optimizedImagesWastedPercent
        .toString()
        .split(".")[0];

    // optimizedImagesCo2: "",
    document.querySelector("[data-field=optimizedImagesCo2]").textContent =
        "CO2 wasted: " + siteInfo.optimizedImagesCo2 + " g";

    // Image data
    imageFromURL.src = siteInfo.imageData;
    splashWidth = siteInfo.imageWidth;
    splashHeight = siteInfo.imageHeight;
}

function changeInfoList(siteInfo) {
    // energyUsed: "",
    document.querySelector("[data-field=energyUsedChange]").textContent =
        "Energy used: " + siteInfo.energyUsed + " " + powerSuffix;
    //     // co2GridGrams: "",
    document.querySelector("[data-field=co2GridGramsChange]").textContent =
        "CO2 total: " + siteInfo.co2GridGrams + " " + weightSuffix;
    //     // co2RenewableGrams: "",
    document.querySelector("[data-field=co2RenewableGramsChange]").textContent =
        "CO2 renewable: " + siteInfo.co2RenewableGrams + " " + weightSuffix;

    // unusedCSStotalBytes: "",
    document.querySelector("[data-field=unusedCSStotalBytesChange]").innerHTML =
        "Total: " + siteInfo.unusedCSStotalBytes + " " + numSuffix;
    // unusedCSSwastedBytes: "",
    document.querySelector(
        "[data-field=unusedCSSwastedBytesChange]"
    ).textContent = "Wasted: " + siteInfo.unusedCSSwastedBytes + " " + numSuffix;
    // unusedCSSwastedPercent: "",
    document.querySelector(
        "[data-field=unusedCSSwastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.unusedCSSwastedPercent + " %";
    // unusedCSSCo2: "",
    document.querySelector("[data-field=unusedCSSCo2Change]").textContent =
        " CO2 wasted: " + siteInfo.unusedCSSCo2 + " g";

    // unusedJStotalBytes: "",
    document.querySelector("[data-field=unusedJStotalBytesChange]").textContent =
        "Total: " + siteInfo.unusedJStotalBytes + " " + numSuffix;
    // unusedJSwastedBytes: "",
    document.querySelector("[data-field=unusedJSwastedBytesChange]").textContent =
        "Wasted: " + siteInfo.unusedJSwastedBytes + " " + numSuffix;
    // unusedJSwastedPercent: "",
    document.querySelector(
        "[data-field=unusedJSwastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.unusedJSwastedPercent + " %";
    // unusedJSCo2: "",
    document.querySelector("[data-field=unusedJSCo2Change]").textContent =
        "CO2 wasted: " + siteInfo.unusedJSCo2 + " g";

    // unminCSStotalBytes: "",
    document.querySelector("[data-field=unminCSStotalBytesChange]").textContent =
        "Total: " + siteInfo.unminCSStotalBytes + " " + numSuffix;
    // unminCSSwastedBytes: "",
    document.querySelector("[data-field=unminCSSwastedBytesChange]").textContent =
        "Wasted: " + siteInfo.unminCSSwastedBytes + " " + numSuffix;
    // unminCSSwastedPercent: "",
    document.querySelector(
        "[data-field=unminCSSwastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.unminCSSwastedPercent + " %";
    // unminCSSCo2: "",
    document.querySelector("[data-field=unminCSSCo2Change]").textContent =
        "CO2 wasted: " + siteInfo.unminCSSCo2 + " g";

    // unminJStotalBytes: "",
    document.querySelector("[data-field=unminJStotalBytesChange]").textContent =
        "Total: " + siteInfo.unminJStotalBytes + " " + numSuffix;
    // unminJSwastedBytes: "",
    document.querySelector("[data-field=unminJSwastedBytesChange]").textContent =
        "Wasted: " + siteInfo.unminJSwastedBytes + " " + numSuffix;
    // unminJSwastedPercent: "",
    document.querySelector(
        "[data-field=unminJSwastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.unminJSwastedPercent + " %";
    // unminJSCo2: "",
    document.querySelector("[data-field=unminJSCo2Change]").textContent =
        "CO2 wasted: " + siteInfo.unminJSCo2 + " g";

    // modernImageFormatTotalBytes: "",
    document.querySelector(
            "[data-field=modernImageFormatTotalBytesChange]"
        ).textContent =
        "Total: " + siteInfo.modernImageFormatTotalBytes + " " + numSuffix;
    // modernImageFormatWastedBytes: "",
    document.querySelector(
            "[data-field=modernImageFormatWastedBytesChange]"
        ).textContent =
        "Wasted: " + siteInfo.modernImageFormatWastedBytes + " " + numSuffix;
    // modernImageFormatWastedPercent: "",
    document.querySelector(
        "[data-field=modernImageFormatWastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.modernImageFormatWastedPercent + " %";
    // modernImageFormatCo2: "",
    document.querySelector(
        "[data-field=modernImageFormatCo2Change]"
    ).textContent = "CO2 wasted: " + siteInfo.modernImageFormatCo2 + " g";

    // responsiveImagesTotalBytes: "",
    document.querySelector(
            "[data-field=responsiveImagesTotalBytesChange]"
        ).textContent =
        "Total: " + siteInfo.responsiveImagesTotalBytes + " " + numSuffix;
    // responsiveImagesWastedBytes: "",
    document.querySelector(
            "[data-field=responsiveImagesWastedBytesChange]"
        ).textContent =
        "Wasted: " + siteInfo.responsiveImagesWastedBytes + " " + numSuffix;
    // responsiveImagesWastedPercent: "",
    document.querySelector(
        "[data-field=responsiveImagesWastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.responsiveImagesWastedPercent + " %";
    // responsiveImagesCo2: "",
    document.querySelector("[data-field=responsiveImagesCo2Change]").textContent =
        "CO2 wasted: " + siteInfo.responsiveImagesCo2 + " g";

    // optimizedImagesTotalBytes: "",
    document.querySelector(
            "[data-field=optimizedImagesTotalBytesChange]"
        ).textContent =
        "Total: " + siteInfo.optimizedImagesTotalBytes + " " + numSuffix;
    // optimizedImagesWastedBytes: "",
    document.querySelector(
            "[data-field=optimizedImagesWastedBytesChange]"
        ).textContent =
        "Wasted: " + siteInfo.optimizedImagesWastedBytes + " " + numSuffix;
    // optimizedImagesWastedPercent: "",
    document.querySelector(
        "[data-field=optimizedImagesWastedPercentChange]"
    ).textContent = "Wasted: " + siteInfo.optimizedImagesWastedPercent + " %";
    // optimizedImagesCo2: "",
    document.querySelector("[data-field=optimizedImagesCo2Change]").textContent =
        "CO2 wasted: " + siteInfo.optimizedImagesCo2 + " g";
}

// Paint each screenshot image pixel to the canvas
imageFromURL.addEventListener("load", function() {
    const splashCanvas = document.getElementById("imgFromURL");
    const splashCTX = splashCanvas.getContext("2d");

    // <-- Outcommented code to set the image size to be the div size  -->
    // splashWidth = document.getElementById('imgDiv').offsetWidth;
    // splashHeight = document.getElementById('imgDiv').offsetHeight;

    splashCanvas.width = splashWidth;
    splashCanvas.height = splashHeight;

    // Draw image from the 2d image context fetched from pagespeed
    splashCTX.drawImage(
        imageFromURL,
        0,
        0,
        splashCanvas.width,
        splashCanvas.height
    );
    // Make the pixels what the image data says they are
    const pixels = splashCTX.getImageData(
        0,
        0,
        splashCanvas.width,
        splashCanvas.height
    );

    let mappedImage = [];
    // Cell brightness is actually inherited so this variable isn't needed but console will through an error if it isn't defined.
    let cellBrightness = [];

    // Define rows on the x and y axis from height and width and then calculate relative brightness to define the colors of each pixel
    for (let y = 0; y < splashCanvas.height; y++) {
        let row = [];
        for (let x = 0; x < splashCanvas.width; x++) {
            const red = pixels.data[y * 4 * pixels.width + x * 4];
            const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
            const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
            const brightness = calculateRelativeBrightness(red, green, blue);

            // Define each cell color to be pushed to each row
            const cell = [(cellBrightness = brightness)];
            row.push(cell);
        }
        mappedImage.push(row);
    }

    // To calculate relative brightness of an image, you need the basic numbers. They can be changed if you feel they don't give you the exact look you're looking for
    function calculateRelativeBrightness(red, green, blue) {
        return (
            Math.sqrt(
                red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
            ) / 100
        );
    }

    // When image is portrayed the loadinganimation should stop.
    endLoadingAnimation();
});

function endLoadingAnimation() {
    let loader = document.getElementById("loading_icon");
    loader.classList.add("hide");
}