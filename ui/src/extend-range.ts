import { Line, SelectionRange, Text } from "@codemirror/state"

export type ExtendRange = (range: SelectionRange, doc: Text) => SelectionRange

export function extendToLine(selection: SelectionRange, doc: Text): SelectionRange {
    let line = doc.lineAt(selection.from);
    return selection.extend(line.from, line.to);
}

export function extendToAll(selection: SelectionRange, doc: Text): SelectionRange {
    return selection.extend(0, doc.length);
}

export function extendToBlock(selection: SelectionRange, doc: Text): SelectionRange {
    let startingLine = findBlockEdge(doc, doc.lineAt(selection.from), -1);
    let endingLine = findBlockEdge(doc, doc.lineAt(selection.to), +1);

    return selection.extend(startingLine.from, endingLine.to);
}

function findBlockEdge(doc: Text, currentLine: Line, direction: number) {
    if (currentLine.length === 0) {
        return currentLine;
    } else {
        try {
            let nextLine = doc.line(currentLine.number + direction);
            if (nextLine.length === 0) {
                return currentLine;
            } else {
                return findBlockEdge(doc, nextLine, direction)
            }
        } catch {
            return currentLine;
        }        
    }
}
