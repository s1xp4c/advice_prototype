"use strict"
let fieldValue
fieldValue = localStorage.getItem("fieldValue");
// const endpoint = "https://pokerplayers-806c.restdb.io/rest/db-json/"
export const endpoint = "https://lighthouse-d41b.restdb.io/rest/"
const industry = fieldValue
    // const restKey = "d1725730fa3e0c99d4ac5adc3aab6ab8ab214"
export const restKey = "624ed26367937c128d7c95c6"

export function stringifyJSON(siteData) {
    let postSiteInfo

    postSiteInfo = JSON.stringify(siteData)
    console.log(postSiteInfo)
    pushSiteInfo(postSiteInfo)
}

export async function pushSiteInfo(postSiteInfo) {

    await fetch(endpoint + industry, {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": restKey,
                "cache-control": "no-cache"
            },
            body: postSiteInfo,
        })
        .then(response => response.json())
        .then(data => console.log(data))

}