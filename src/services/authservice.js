import { url } from "./utils"

export const authService = {
    login,
    saveToken, getToken
}

async function login(inputs) {
    let name = inputs.name
    let password = inputs.password
    let reqBody = {
            "username":name,
            "password":password
        }
    console.log(reqBody)
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

function saveToken(token, user, name) {
    localStorage.setItem("sessiontoken", token)
    localStorage.setItem("userid", user)
    localStorage.setItem("username", name)
}
function getToken() {
}

