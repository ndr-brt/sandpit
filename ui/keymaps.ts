import { EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'

export class EvaluateAll implements KeyBinding {
    key = "Ctrl-Enter"
    
    run(view: EditorView) {
        let code = view.state.doc.toString()

        invoke('tidal_eval', { code })
            .then(v => console.log(`Report should be written! result ${v}`))

        return true;
    }
}
