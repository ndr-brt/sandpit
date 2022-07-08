import {showPanel} from "@codemirror/view"
import {EditorView, Panel} from "@codemirror/view"
import { listen } from '@tauri-apps/api/event'

export function console() {
  return showPanel.of(consolePanel)
}

function consolePanel(view: EditorView): Panel {
  let dom = document.createElement("div")

  const unlisten = listen('log', event => {
    dom.textContent += `${event.payload}<br>`
  })

  return { dom }
}