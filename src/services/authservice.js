import { url } from "./utils"

export const authService = {
    login, windowsLogin,
    saveToken, getToken
}

async function windowsLogin() {
    const request = new Request(`${url}/auth/windowslogin`, {
        method: "GET",
        headers:
        {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
    const response = await fetch(request)
    if(!response.ok) return response.status
    return await response.json()
}

async function login(inputs) {
    let name = inputs.name
    let password = inputs.password
    let reqBody = {
            "username":name,
            "password":password
        }
    const request = new Request(`${url}/auth/login`, {
        method: "POST",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    const response = await fetch(request)
    if(!response.ok) return response.status
    return await response.json()
}

function saveToken(token, name, role) {
    localStorage.setItem("sessiontoken", token)
    localStorage.setItem("username", name)
    localStorage.setItem("role", role)
}
function getToken() {
}

