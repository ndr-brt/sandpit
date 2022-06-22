import { EditorState, StateField, Transaction } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvaluateAll } from "./keymaps"

let editor = new EditorView({
  state: EditorState.create({
    doc: "Hello worldfdsafdsafdsaf",
    extensions: [
      keymap.of([new EvaluateAll()]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  }),
  parent: document.body
})