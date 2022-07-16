import {showPanel} from "@codemirror/view"
import {EditorView, Panel} from "@codemirror/view"
import { listen } from '@tauri-apps/api/event'

export function console() {
  return showPanel.of(consolePanel)
}

function consolePanel(view: EditorView): Panel {
  let dom = document.createElement("div")
  dom.scroll()

  listen('log', event => {
    dom.appendChild(document.createTextNode(`${event.payload.type} | ${event.payload.message}`))
    dom.appendChild(document.createElement("br"))
    dom.scrollIntoView({ block: "end", inline: "nearest" })
  })

  return { dom }
}