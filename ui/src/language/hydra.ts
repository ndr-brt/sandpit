import { Language } from "./language";
import HydraSynth from "hydra-synth/dist/hydra-synth"

export class Hydra implements Language {

    constructor() {
        const hydraSynth = new HydraSynth({ 
            detectAudio: false,
            canvas: document.getElementById("canvas")
          })
    }

    eval(code: string): void {
        eval(code)
    }

}