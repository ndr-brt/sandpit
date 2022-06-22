import { EditorView, KeyBinding } from "@codemirror/view"

export class EvaluateAll implements KeyBinding {
    key = "Ctrl-Enter"
    
    run(view: EditorView) {
        // let tidal = view.state.field('tidal')
        // console.log(tidal)
        view.dispatch({
            changes: { from: 0, insert: "evaluate!" }
        })
        return true;
    }
}
