import { invoke } from '@tauri-apps/api/tauri'
import { Language } from "./language";

export class Tidal implements Language {
    eval(code: string): void {
        invoke('tidal_eval', { code })
    }
    
}