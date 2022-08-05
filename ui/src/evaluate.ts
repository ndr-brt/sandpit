import { SelectionRange, StateEffectType } from "@codemirror/state";
import { Decoration, EditorView, KeyBinding } from "@codemirror/view"
import { ExtendRange } from "./extend-range";
import { Language } from "./language/language";

export class Evaluate implements KeyBinding {

    key?: string;
    addMarks: StateEffectType<any>;
    filterMarks: StateEffectType<any>;
    extend: ExtendRange;
    language: Language;

    constructor(key: string, addMarks: StateEffectType<any>, filterMarks: StateEffectType<any>, extend: ExtendRange, language: Language) {
        this.key = key
        this.addMarks = addMarks,
        this.filterMarks = filterMarks,
        this.extend = extend
        this.language = language;
    }

    run = (view: EditorView) => {
        let doc = view.state.doc
        let cursorAt = view.state.selection.ranges[0]

        let block = this.extend(cursorAt, doc)
        
        if (block.from !== block.to) {
            let code = doc.sliceString(block.from, block.to)

            this.flash(view, block)
            this.language.eval(code)
            
            return true;
        } else {
            return false;
        }
    }

    private flash(view: EditorView, range: SelectionRange) {
        const strikeMark = Decoration.mark({
            attributes: { class: "flash-selection"}
        })
    
        view.dispatch({
            effects: this.addMarks.of([strikeMark.range(range.from, range.to)])
        })

        setTimeout(() => {
            view.dispatch({
                effects: this.filterMarks.of((from, to) => to <= range.from || from >= range.to)
              })
        }, 400);
    }

}