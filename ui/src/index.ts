import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, Decoration } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { Evaluate } from "./evaluate"
import { extendToAll, extendToBlock, extendToLine } from "./extend-range";
import { listen } from "@tauri-apps/api/event";
import { javascript } from "@codemirror/lang-javascript";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import HydraSynth from "hydra-synth/dist/hydra-synth"
import { Tidal } from "./language/tidal";
import { Hydra } from "./language/hydra";

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

const tidal = new Tidal()
const tidalEvaluateAll = new Evaluate("Ctrl-Shift-Enter", addMarks, extendToAll, tidal)
const tidalEvaluateLine = new Evaluate("Shift-Enter", addMarks, extendToLine, tidal)
const tidalEvaluateBlock = new Evaluate("Ctrl-Enter", addMarks, extendToBlock, tidal)

let tidalEditor = new EditorView({
  state: EditorState.create({
    extensions: [
      syntaxHighlighting(defaultHighlightStyle),
      markField,
      keymap.of([tidalEvaluateAll, tidalEvaluateLine, tidalEvaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  })
})

const hydra = new Hydra();
const hydraEvaluateAll = new Evaluate("Ctrl-Shift-Enter", addMarks, extendToAll, hydra)
const hydraEvaluateLine = new Evaluate("Shift-Enter", addMarks, extendToLine, hydra)
const hydraEvaluateBlock = new Evaluate("Ctrl-Enter", addMarks, extendToBlock, hydra)

let hydraEditor = new EditorView({
  state: EditorState.create({
    extensions: [      
      syntaxHighlighting(defaultHighlightStyle),
      javascript(),
      markField,
      keymap.of([hydraEvaluateAll, hydraEvaluateLine, hydraEvaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  })
})

document.body.appendChild(tidalEditor.dom)
document.body.appendChild(hydraEditor.dom)

let console = document.getElementById("console")

listen('log', event => {
  console.appendChild(document.createTextNode(`${event.payload.level} | ${event.payload.message}`))
  console.appendChild(document.createElement("br"))
  console.scrollIntoView({ block: "end", inline: "nearest" })
})

tidalEditor.focus()


const hydraSynth = new HydraSynth({ 
  detectAudio: false,
  canvas: document.getElementById("canvas")
})