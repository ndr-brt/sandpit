import { listen } from "@tauri-apps/api/event";
import { javascript } from "@codemirror/lang-javascript";
import { Tidal } from "./language/tidal";
import { Hydra } from "./language/hydra";
import { editorViewFactory } from "./editor-view-factory";

let tidalEditor = editorViewFactory(new Tidal());
let hydraEditor = editorViewFactory(new Hydra(), javascript());

document.body.appendChild(tidalEditor.dom)
document.body.appendChild(hydraEditor.dom)

let console = document.getElementById("console")

listen('log', event => {
  console.appendChild(document.createTextNode(`${event.payload.level} | ${event.payload.message}`))
  console.appendChild(document.createElement("br"))
  console.scrollIntoView({ block: "end", inline: "nearest" })
})

tidalEditor.focus()