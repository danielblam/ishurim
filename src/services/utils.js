export var url = null; // = 'https://localhost:7063/api'

function headers(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function initUrl() {
    const response = await fetch("/config.json")
    const json = await response.json()
    url = json.apiUrl
}

export function redirectToLogin() {
    window.location.href = "/"
}

export async function checkSession(token) {
    const request = new Request(`${url}/auth/ping`, {
        method: "GET",
        headers: headers(token)
    })
    const response = await fetch(request)
    if (response.ok) return true
    return false
}