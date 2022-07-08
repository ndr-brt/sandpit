import {showPanel} from "@codemirror/view"
import {EditorView, Panel} from "@codemirror/view"
import { listen } from '@tauri-apps/api/event'

export function console() {
  return showPanel.of(consolePanel)
}

function consolePanel(view: EditorView): Panel {
  let dom = document.createElement("div")

  listen('log', event => {
    dom.appendChild(document.createTextNode(`${event.payload}`));
    dom.appendChild(document.createElement("br"));
  })

  return { dom }
}