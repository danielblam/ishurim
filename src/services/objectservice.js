// a generalized service for hospitals, institutes, tests, vehicles, possibly approvers and approvals too

import { url } from "./utils"

function headers(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

async function getObjectList(type, token) {
    const request = new Request(`${url}/${type}`, {
        method: "GET",
        headers: headers(token)
    })
    const response = await fetch(request)
    if (!response.ok) return response.status
    return await response.json()
}

async function addObject(type, token, object) {
    const request = new Request(`${url}/${type}`, {
        method: "POST",
        headers: headers(token),
        body: JSON.stringify(object)
    })
    const response = await fetch(request)
    return response.status
}

async function editObject(type, token, object) {
    const request = new Request(`${url}/${type}`, {
        method: "PUT",
        headers: headers(token),
        body: JSON.stringify(object)
    })
    const response = await fetch(request)
    return response.status
}

async function deleteObject(type, token, objectId) {
    const request = new Request(`${url}/${type}/${objectId}`, {
        method: "DELETE",
        headers: headers(token)
    })
    const response = await fetch(request)
    return response.status
}

export const objectService = {
    getObjectList,
    addObject,
    editObject,
    deleteObject
}