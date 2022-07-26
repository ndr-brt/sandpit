import { SelectionRange, StateEffectType } from "@codemirror/state";
import { Decoration, EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'
import { ExtendRange } from "./extend-range";
import { Language } from "./language/language";

export class Evaluate implements KeyBinding {

    key?: string;
    addMarks: StateEffectType<any>;
    extend: ExtendRange;
    language: Language;

    constructor(key: string, addMarks: StateEffectType<any>, extend: ExtendRange, language: Language) {
        this.key = key
        this.addMarks = addMarks,
        this.extend = extend
        this.language = language;
    }

    run = (view: EditorView) => {
        let doc = view.state.doc
        let cursorAt = view.state.selection.ranges[0]

        let block = this.extend(cursorAt, doc)
        
        if (block.from !== block.to) {
            let code = doc.sliceString(block.from, block.to)

            this.flash(view, block, this.addMarks)
            this.language.eval(code)
            
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