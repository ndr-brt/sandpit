import { spawn, ChildProcess } from 'child_process'


export class Tidal {
    process: ChildProcess;

    start() {
        this.process = spawn('ghci', [], { shell: true })
    }

    writeLine(line: String) {
        this.process.stdin.write(line);
        this.process.stdin.write('\n');
    }
}