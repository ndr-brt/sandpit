import { listen } from "@tauri-apps/api/event";

export function initializeConsole() {
    let console = document.getElementById("console")

    listen('log', event => {
        let payload;
        try {
            payload = JSON.parse(event.payload)
        } catch (error) {
            payload = event.payload
        }

        let elementClass = payload.level === 'info' ? 'log-info' : 'log-error'

        let textNode = document.createTextNode(`${payload.language} | ${payload.message}`)
        var span = document.createElement('span');
        span.classList.add(elementClass)
        span.appendChild(textNode)
        
        console.appendChild(span)
            
        console.appendChild(document.createElement("br"))
        console.scrollIntoView({ block: "end", inline: "nearest" })
    })
}