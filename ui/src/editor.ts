import { EditorState, StateField, Transaction } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { EvaluateAll } from "./keymaps"
import { Tidal } from "./tidal";

const tidal = StateField.define({
  
  create(state: EditorState) { 
    console.log('StateField CREATE')
    return new Tidal() 
  },

  update(value: Tidal, transaction: Transaction) {
    console.log('State Field UPDATE')
    value.start();
    return value
  }
})

let editor = new EditorView({
  state: EditorState.create({
    doc: "Hello worldfdsafdsafdsaf",
    extensions: [
      keymap.of([new EvaluateAll()]),
      keymap.of(defaultKeymap), 
      oneDarkTheme,
      tidal
    ]
  }),
  parent: document.body
})