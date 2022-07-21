import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, Decoration } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { Evaluate } from "./evaluate"
import { console } from "./console"
import { title } from "./title"
import { extendToAll, extendToBlock, extendToLine } from "./extend-range";

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


let editor = new EditorView({
  state: EditorState.create({
    extensions: [
      markField,
      keymap.of([evaluateAll, evaluateLine, evaluateBlock]),
      keymap.of(defaultKeymap), 
      oneDarkTheme,
      title(),
      console()
    ]
  }),
  parent: document.body
})

editor.focus()