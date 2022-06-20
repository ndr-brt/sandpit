import { KeyBinding } from "@codemirror/view"

export class EvalBlock implements KeyBinding {
    key = "Ctrl-Enter"
    
    run() { 
        console.log("Eval block!"); 
        return true 
    }
}
