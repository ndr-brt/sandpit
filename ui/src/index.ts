import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, showPanel, Panel, Decoration } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvaluateAll } from "./keymaps"
import { console } from "./console"
import { title } from "./title"

// Effects can be attached to transactions to communicate with the extension
const addMarks = StateEffect.define(), filterMarks = StateEffect.define()

// This value must be added to the set of extensions to enable this
const markField = StateField.define({
  // Start with an empty set of decorations
  create() { return Decoration.none },
  // This is called whenever the editor updates—it computes the new set
  update(value, tr) {
    // Move the decorations to account for document changes
    value = value.map(tr.changes)
    // If this transaction adds or removes decorations, apply those changes
    for (let effect of tr.effects) {
      if (effect.is(addMarks)) value = value.update({add: effect.value, sort: true})
      else if (effect.is(filterMarks)) value = value.update({filter: effect.value})
    }
    return value
  },
  // Indicate that this field provides a set of decorations
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