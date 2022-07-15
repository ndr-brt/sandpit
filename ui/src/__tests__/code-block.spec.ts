import { expect, test } from '@jest/globals';
import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { CodeBlock } from "../../code-block"

test('without code there are no code blocks', () => {
    let view = createView('')

    let results = CodeBlock.createFrom(view.viewportLineBlocks)

    expect(results).toHaveLength(0)    
})

test('single line code block', () => {
    let view = createView('a')

    let results = CodeBlock.createFrom(view.viewportLineBlocks)

    expect(results).toHaveLength(1)
    expect(results[0].from).toBe(0)
    expect(results[0].length).toBe(1)
})

test('multiple line code blocks', () => {
    let view = createView('a\nb')

    let results = CodeBlock.createFrom(view.viewportLineBlocks)

    expect(results).toHaveLength(1)
    expect(results[0].from).toBe(0)
    expect(results[0].length).toBe(3)
})

test('multiple code blocks', () => {
    let view = createView('a\nb\n\nc\nd')

    let results = CodeBlock.createFrom(view.viewportLineBlocks)

    expect(results).toHaveLength(2)
    expect(results[0].from).toBe(0)
    expect(results[0].length).toBe(3)
    expect(results[1].from).toBe(5)
    expect(results[1].length).toBe(3)
})

let createView = (doc: string) => {
    return new EditorView({
        state: EditorState.create({ doc })
    })
}