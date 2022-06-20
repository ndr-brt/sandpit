import { EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvalBlock } from "./keymaps"

let editor = new EditorView({
  state: EditorState.create({
    doc: "Hello world",
    extensions: [
      keymap.of([new EvalBlock()]),
      keymap.of(defaultKeymap), 
      oneDarkTheme
    ]
  }),
  parent: document.body
})