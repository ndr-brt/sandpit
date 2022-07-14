import { EditorState, StateField, StateEffect } from "@codemirror/state"
import { EditorView, keymap, showPanel, Panel } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvaluateAll } from "./keymaps"
import { console } from "./console"
import { title } from "./title"

let editor = new EditorView({
  state: EditorState.create({
    extensions: [
      keymap.of([new EvaluateAll()]),
      keymap.of(defaultKeymap), 
      oneDarkTheme,
      title(),
      console()
    ]
  }),
  parent: document.body
})

editor.focus()