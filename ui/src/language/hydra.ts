import { Language } from "./language";

export class Hydra implements Language {
    eval(code: string): void {
        eval(code)
    }

}