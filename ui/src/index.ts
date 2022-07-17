import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, showPanel, Panel, Decoration } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvaluateAll } from "./keymaps"
import { console } from "./console"
import { title } from "./title"

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


let editor = new EditorView({
  state: EditorState.create({
    extensions: [
      markField,
      keymap.of([new EvaluateAll(addMarks, filterMarks)]),
      keymap.of(defaultKeymap), 
      oneDarkTheme,
      title(),
      console()
    ]
  }),
  parent: document.body
})

editor.focus()