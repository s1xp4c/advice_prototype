"use strict"

import { endpoint } from './push.js'
import { restKey } from './push.js'


export async function getData() {

    await fetch(endpoint, {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": restKey,
                "cache-control": "no-cache"
            }
        })
        .then(response => response.json())
        .then(data => fillInfo(data))
}