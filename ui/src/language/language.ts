import { EditorView } from "@codemirror/view";

export interface Language {
    eval(code: string): void;
}