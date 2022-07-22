import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, Decoration } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { Evaluate } from "./evaluate"
import { console } from "./console"
import { extendToAll, extendToBlock, extendToLine } from "./extend-range";
import { listen } from "@tauri-apps/api/event";

const addMarks = StateEffect.define(), filterMarks = StateEffect.define()

const markField = StateField.define({
  create() { return Decoration.none },
  update(value, tr) {
    value = value.map(tr.changes)
    for (let effect of tr.effects) {
      if (effect.is(addMarks)) value = value.update({add: effect.value, sort: true})
      else if (effect.is(filterMarks)) value = value.update({filter: effect.value})
    }
    return value
  },
  provide: f => EditorView.decorations.from(f)
})

const evaluateAll = new Evaluate("Ctrl-Shift-Enter", addMarks, extendToAll)
const evaluateLine = new Evaluate("Shift-Enter", addMarks, extendToLine)
const evaluateBlock = new Evaluate("Ctrl-Enter", addMarks, extendToBlock)

let tidal = new EditorView({
  state: EditorState.create({
    extensions: [
      markField,
      keymap.of([evaluateAll, evaluateLine, evaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  })
})

let hydra = new EditorView({
  state: EditorState.create({
    extensions: [
      markField,
      keymap.of([evaluateAll, evaluateLine, evaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  })
})

document.body.appendChild(tidal.dom)
document.body.appendChild(hydra.dom)

let console = document.getElementById("console")

listen('log', event => {
  console.appendChild(document.createTextNode(`${event.payload.level} | ${event.payload.message}`))
  console.appendChild(document.createElement("br"))
  console.scrollIntoView({ block: "end", inline: "nearest" })
})

tidal.focus()