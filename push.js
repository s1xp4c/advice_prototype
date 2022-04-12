"use strict"
// var request = require("request");
// const endpoint = "https://pokerplayers-806c.restdb.io/rest/db-json/"
const endpoint = "https://lighthouse-d41b.restdb.io/rest/siteinfo"
    // const restKey = "d1725730fa3e0c99d4ac5adc3aab6ab8ab214"
const restKey = "624ed26367937c128d7c95c6"

export function stringifyJSON(siteData) {
    let postSiteIfo

    postSiteIfo = JSON.stringify(siteData)
    console.log(postSiteIfo)
    pushSiteInfo(postSiteIfo)
}

async function pushSiteInfo(postSiteIfo) {

    await fetch({
        method: 'POST',
        url: endpoint,
        headers: {
            'cache-control': 'no-cache',
            'x-apikey': restKey,
            'content-type': 'application/json'
        },
        body: postSiteIfo,
        json: true,

    })

    // .then(response => response.json())
    //     .then(data => console.log(data))


}