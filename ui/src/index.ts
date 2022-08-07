import { listen } from "@tauri-apps/api/event";
import { javascript } from "@codemirror/lang-javascript";
import { Tidal } from "./language/tidal";
import { Hydra } from "./language/hydra";
import { editorViewFactory } from "./editor-view-factory";
import { initializeConsole } from "./console";

initializeConsole()

let tidalEditor = editorViewFactory(new Tidal());
let hydraEditor = editorViewFactory(new Hydra(), javascript());

document.body.appendChild(tidalEditor.dom)
document.body.appendChild(hydraEditor.dom)

tidalEditor.focus()
