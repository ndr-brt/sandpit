import { BlockInfo, EditorView, KeyBinding } from "@codemirror/view"
import { invoke } from '@tauri-apps/api/tauri'
import { CodeBlock } from "./code-block";

export class EvaluateAll implements KeyBinding {
    key = "Ctrl-Enter"
    
    run(view: EditorView) {

        let cursorAt = view.state.selection.ranges[0];

        let blocks = CodeBlock.createFrom(view.viewportLineBlocks)

        let codeBlock = blocks
            .find(block => block.contains(cursorAt));


        if (codeBlock) {
            let code = view.state.doc.sliceString(codeBlock.from, codeBlock.from + codeBlock.length)

            console.log(code)

            invoke('tidal_eval', { code })
                .then(v => console.log(`Report should be written! result ${v}`))
            return true;
        } else {
            return false;
        }
    }
}