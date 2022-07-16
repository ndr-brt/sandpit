import {showPanel} from "@codemirror/view"
import {EditorView, Panel} from "@codemirror/view"

export function title() {
  return showPanel.of(titlePanel)
}

function titlePanel(view: EditorView): Panel {
  let dom = document.createElement("div")
 
  let title = document.createElement('h1')
  title.textContent = "... sandpit ..."
  dom.appendChild(title)

  return { top: true, dom }
}