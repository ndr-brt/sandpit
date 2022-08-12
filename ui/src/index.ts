import { javascript } from "@codemirror/lang-javascript";
import { Tidal } from "./language/tidal";
import { Hydra } from "./language/hydra";
import { editorViewFactory } from "./editor-view-factory";
import { initializeConsole } from "./console";
import Split from 'split.js'

let editors = []

initializeConsole()

document.getElementById('add-editor').addEventListener('click', () => {
    
    let language = document.getElementById('language') as HTMLSelectElement;
    let selected = language.options[language.selectedIndex].text
    console.log('suuuuuuuuuuuuuuuuuuuuuu ' + selected)

    let editor
    switch (selected) {
        case 'tidal':
            editor = editorViewFactory(new Tidal());
            break;
        case 'hydra':
            editor = editorViewFactory(new Hydra(), javascript());
            break;
    }
        
    if (editor) {
        let id = `${selected}-${new Date().getTime().toString()}`;
        editor.dom.id = id
        document.getElementById('editors').appendChild(editor.dom)
        
        editors.push({
            id,
            language,
            instance: editor
        })

        let split = editors.map(e => ({ id: `#${e.id}`, size: 100/editors.length}))

        Split(split.map(it => it.id), {
            sizes: split.map(it => it.size)
        })

        editor.focus()        
    }    
   
});