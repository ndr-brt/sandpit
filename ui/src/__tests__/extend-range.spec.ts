import { EditorSelection, Text } from "@codemirror/state"
import { extendToAll, extendToBlock, extendToLine } from "../extend-range"

test('extendToLine', () => {
    let cursor = EditorSelection.cursor(3)
    let code = Text.of(['ab', 'cd'])

    let result = extendToLine(cursor, code)
    
    expect(result.from).toEqual(3)
    expect(result.to).toEqual(5)
})

test('extendToAll', () => {
    let cursor = EditorSelection.cursor(3)
    let code = Text.of(['ab', 'cd'])

    let result = extendToAll(cursor, code)
    
    expect(result.from).toEqual(0)
    expect(result.to).toEqual(5)
})

test('extendToBlock with a single block', () => {
    let cursor = EditorSelection.cursor(2)
    let code = Text.of(['ab', 'cd'])

    let result = extendToBlock(cursor, code)
    
    expect(result.from).toEqual(0)
    expect(result.to).toEqual(5)
});

test('extendToBlock with another block below', () => {
    let cursor = EditorSelection.cursor(2)
    let code = Text.of(['ab', 'cd', '', 'ef'])

    let result = extendToBlock(cursor, code)
    
    expect(result.from).toEqual(0)
    expect(result.to).toEqual(5)
})

test('extendToBlock with another block above', () => {
    let cursor = EditorSelection.cursor(8)
    let code = Text.of(['ab', 'cd', '', 'ef'])

    let result = extendToBlock(cursor, code)
    
    expect(result.from).toEqual(7)
    expect(result.to).toEqual(9)
})

test('extendToBlock on an empty line does not extend', () => {
    let cursor = EditorSelection.cursor(6)
    let code = Text.of(['ab', 'cd', '', 'ef'])

    let result = extendToBlock(cursor, code)
    
    expect(result.from).toEqual(6)
    expect(result.to).toEqual(6)
})