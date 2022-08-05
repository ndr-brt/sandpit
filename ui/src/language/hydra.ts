import { Language } from "./language";
import HydraSynth from "hydra-synth/dist/hydra-synth"
import { emit } from '@tauri-apps/api/event'

export class Hydra implements Language {

    constructor() {
        const hydraSynth = new HydraSynth({ 
            detectAudio: false,
            canvas: document.getElementById("canvas")
        })
        emit('log', {
            message: "Hydra synth started",
            level: "info",
            language: 'hydra'
        })
    }

    eval(code: string): void {
        try {
            eval(code)
        } catch (error) {
            // if (error instanceof SyntaxError || error instanceof EvalError) {
                emit('log', { 
                    message: error.message,
                    level: "error",
                    language: 'hydra'
                })
            // }
            
        }
    }

}