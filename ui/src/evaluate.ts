import { SelectionRange, StateEffectType } from "@codemirror/state";
import { Decoration, EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'
import { ExtendRange } from "./extend-range";

export class Evaluate implements KeyBinding {

    key?: string;
    addMarks: StateEffectType<any>;
    extend: ExtendRange;

    constructor(key: string, addMarks: StateEffectType<any>, extend: ExtendRange) {
        this.key = key
        this.addMarks = addMarks,
        this.extend = extend
    }

    run = (view: EditorView) => {
        let doc = view.state.doc
        let cursorAt = view.state.selection.ranges[0]

        let block = this.extend(cursorAt, doc)
        
        if (block.from !== block.to) {
            let code = doc.sliceString(block.from, block.to)

            this.flash(view, block, this.addMarks)

            invoke('tidal_eval', { code })
                .then(v => console.log(`Report should be written! result ${v}`))
            return true;
        } else {
            return false;
        }
    }

    private flash(view: EditorView, range: SelectionRange, addMarks: StateEffectType<any>) {
        const strikeMark = Decoration.mark({
            attributes: { class: "flash-selection"}
        })
    
        view.dispatch({
            effects: addMarks.of([strikeMark.range(range.from, range.to)])
        })
    }

}