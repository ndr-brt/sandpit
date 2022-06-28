import { EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'

export class EvaluateAll implements KeyBinding {
    key = "Ctrl-Enter"
    
    run(view: EditorView) {
        invoke('tidal_ghci_start')
            .then(v => console.log(`Report should be written! result ${v}`))

        view.dispatch({
            changes: { from: 0, insert: "evaluate!" }
        })
        return true;
    }
}
