export var url = null; // = 'https://localhost:7063/api'

export async function initUrl() {
    const response = await fetch("config.json")
    const json = await response.json()
    url = json.apiUrl
}