import { defaultKeymap } from "@codemirror/commands";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState, Extension, StateEffect, StateField } from "@codemirror/state";
import { oneDarkTheme } from "@codemirror/theme-one-dark";
import { Decoration, EditorView, keymap } from "@codemirror/view";
import { Evaluate } from "./evaluate";
import { extendToAll, extendToBlock, extendToLine } from "./extend-range";
import { Language } from "./language/language";

export function editorViewFactory(language: Language, ...additionalExtensions: Extension[]): EditorView {
    const addEvalMarks = StateEffect.define(), filterEvalMarks = StateEffect.define()

        const markEvalField = StateField.define({
            create() { return Decoration.none },
            update(value, tr) {
                value = value.map(tr.changes)
                for (let effect of tr.effects) {
                if (effect.is(addEvalMarks)) value = value.update({add: effect.value, sort: true})
                else if (effect.is(filterEvalMarks)) value = value.update({filter: effect.value})
                }
                return value
            },
            provide: f => EditorView.decorations.from(f)
        })


        const addBackgroundMarks = StateEffect.define(), filterBackgroundMarks = StateEffect.define()

        const markBackgroundField = StateField.define({
            create() { return Decoration.none },
            update(value, tr) {
                value = value.map(tr.changes)
                for (let effect of tr.effects) {
                if (effect.is(addBackgroundMarks)) value = value.update({add: effect.value, sort: true})
                else if (effect.is(filterBackgroundMarks)) value = value.update({filter: effect.value})
                }
                return value
            },
            provide: f => EditorView.decorations.from(f)
        })

        const tidalEvaluateAll = new Evaluate("Ctrl-Shift-Enter", addEvalMarks, filterEvalMarks, extendToAll, language)
        const tidalEvaluateLine = new Evaluate("Shift-Enter", addEvalMarks, filterEvalMarks, extendToLine, language)
        const tidalEvaluateBlock = new Evaluate("Ctrl-Enter", addEvalMarks, filterEvalMarks, extendToBlock, language)

        const tidalUpdateListener = EditorView.updateListener.of(update => {
        const codeBackgroundMark = Decoration.mark({
            attributes: { class: "code-background"}
        })

        let codeLength = update.state.doc.length
            if (update.docChanged && codeLength) {
                update.view.dispatch({
                    effects: [
                        // filterBackgroundMarks.of(true),
                        addBackgroundMarks.of([codeBackgroundMark.range(0, codeLength)])
                    ]
                })
            }

        }); 

        let extensions = [
            syntaxHighlighting(defaultHighlightStyle),
            markEvalField,
            markBackgroundField,
            tidalUpdateListener,
            keymap.of([tidalEvaluateAll, tidalEvaluateLine, tidalEvaluateBlock]),
            keymap.of(defaultKeymap), 
            oneDarkTheme
        ]

        return new EditorView({
            state: EditorState.create({
                extensions: extensions.concat(additionalExtensions)
            })
        })
}