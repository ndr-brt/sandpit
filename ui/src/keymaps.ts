import { StateEffectType } from "@codemirror/state";
import { Decoration, EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'
import { CodeBlock } from "./code-block";

export class EvaluateBlock implements KeyBinding {
    key = "Ctrl-Enter"
    addMarks: StateEffectType<any>;
    filterMarks: StateEffectType<any>;

    constructor(addMarks: StateEffectType<any>, filterMarks: StateEffectType<any>) {
        this.addMarks = addMarks
        this.filterMarks = filterMarks
    }
    
    run = (view: EditorView) => {
        let cursorAt = view.state.selection.ranges[0];

        let blocks = CodeBlock.createFrom(view.viewportLineBlocks)

        let codeBlock = blocks
            .find(block => block.contains(cursorAt));


        if (codeBlock) {
            let code = view.state.doc.sliceString(codeBlock.from, codeBlock.from + codeBlock.length)

            flash(view, codeBlock.from, codeBlock.length, this.addMarks)

            invoke('tidal_eval', { code })
                .then(v => console.log(`Report should be written! result ${v}`))
            return true;
        } else {
            return false;
        }
    }
}

function flash(view: EditorView, from: number, length: number, addMarks: StateEffectType<any>) {
    const strikeMark = Decoration.mark({
        attributes: { class: "flash-selection"}
    })

    view.dispatch({
        effects: addMarks.of([strikeMark.range(from, from + length)])
    })
}