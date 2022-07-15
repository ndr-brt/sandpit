import { SelectionRange } from "@codemirror/state";
import { BlockInfo } from "@codemirror/view"

export class CodeBlock {

    lineBlocks: BlockInfo[]

    static createFrom(blocks: BlockInfo[]): CodeBlock[] {
        return blocks.reduce((acc, it) => {
            if (acc.length == 0) {
                acc.push(new CodeBlock([]))
            }
    
            if (it.length === 0) {
                acc.push(new CodeBlock([]))
            } else {
                acc[acc.length - 1].lineBlocks.push(it)
            }
            return acc;
        }, []).filter(it => !it.isEmpty());
    }

    constructor(lineBlocks: BlockInfo[]) {
        this.lineBlocks = lineBlocks;
    }

    get from(): number {
        return this.lineBlocks[0]?.from;
    }

    get length(): number {
        return this.lineBlocks.map(it => it.length).reduce((a, b) => a + b) + this.lineBlocks.length - 1;
    }

    public isEmpty(): boolean {
        return this.lineBlocks.length === 0
    }

    public contains(range: SelectionRange): boolean {
        return range.from >= this.from && range.from < this.from + this.length;
    }
}