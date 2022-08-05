import { listen } from "@tauri-apps/api/event";
import { javascript } from "@codemirror/lang-javascript";
import { Tidal } from "./language/tidal";
import { Hydra } from "./language/hydra";
import { editorViewFactory } from "./editor-view-factory";

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


let tidalEditor = editorViewFactory(new Tidal());
let hydraEditor = editorViewFactory(new Hydra(), javascript());

document.body.appendChild(tidalEditor.dom)
document.body.appendChild(hydraEditor.dom)

tidalEditor.focus()
