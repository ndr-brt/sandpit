import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, Decoration, gutter, drawSelection } from "@codemirror/view"
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

const addEvalMarks = StateEffect.define(), filterEvalMarks = StateEffect.define()

const markEvalField = StateField.define({
  create() { return Decoration.none },
  update(value, tr) {
    value = value.map(tr.changes)
    for (let effect of tr.effects) {
      if (effect.is(addEvalMarks)) value = value.update({add: effect.value, sort: true})
      else if (effect.is(filterEvalMarks)) value = value.update({filter: effect.value})
    }
    return value
  },
  provide: f => EditorView.decorations.from(f)
})


const addBackgroundMarks = StateEffect.define(), filterBackgroundMarks = StateEffect.define()

const markBackgroundField = StateField.define({
  create() { return Decoration.none },
  update(value, tr) {
    value = value.map(tr.changes)
    for (let effect of tr.effects) {
      if (effect.is(addBackgroundMarks)) value = value.update({add: effect.value, sort: true})
      else if (effect.is(filterBackgroundMarks)) value = value.update({filter: effect.value})
    }
    return value
  },
  provide: f => EditorView.decorations.from(f)
})


const tidal = new Tidal()
const tidalEvaluateAll = new Evaluate("Ctrl-Shift-Enter", addEvalMarks, filterEvalMarks, extendToAll, tidal)
const tidalEvaluateLine = new Evaluate("Shift-Enter", addEvalMarks, filterEvalMarks, extendToLine, tidal)
const tidalEvaluateBlock = new Evaluate("Ctrl-Enter", addEvalMarks, filterEvalMarks, extendToBlock, tidal)

const tidalUpdateListener = EditorView.updateListener.of(update => {
  const codeBackgroundMark = Decoration.mark({
    attributes: { class: "code-background"}
  })

  let codeLength = update.state.doc.length
  if (update.docChanged && codeLength) {
    update.view.dispatch({
      effects: [
        // filterBackgroundMarks.of(true),
        addBackgroundMarks.of([codeBackgroundMark.range(0, codeLength)])
      ]
    })
  }

}); 

let tidalEditor = new EditorView({
  state: EditorState.create({
    extensions: [
      syntaxHighlighting(defaultHighlightStyle),
      markEvalField,
      markBackgroundField,
      tidalUpdateListener,
      keymap.of([tidalEvaluateAll, tidalEvaluateLine, tidalEvaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  })
})

const hydra = new Hydra();
const hydraEvaluateAll = new Evaluate("Ctrl-Shift-Enter", addEvalMarks, filterEvalMarks, extendToAll, hydra)
const hydraEvaluateLine = new Evaluate("Shift-Enter", addEvalMarks, filterEvalMarks, extendToLine, hydra)
const hydraEvaluateBlock = new Evaluate("Ctrl-Enter", addEvalMarks, filterEvalMarks, extendToBlock, hydra)

let hydraEditor = new EditorView({
  state: EditorState.create({
    extensions: [      
      syntaxHighlighting(defaultHighlightStyle),
      javascript(),
      markEvalField,
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