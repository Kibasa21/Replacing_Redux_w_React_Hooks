import { useEffect, useState } from "react";

let globalState = {};
let listeners = [];
let actions = {};

export function useStore(shouldListen = true) {
    const setState = useState(globalState)[1];

    function dispatch(actionIdentifier, payload) {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = { ...globalState, ...newState };

        for (const listener of listeners) {//O que ocorre nesse for é que ele chama todos os listeners que estão na lista de listeners, e passa o estado global para cada um deles.
            listener(globalState);
        }
    }

    useEffect(() =>{//O que ocorre nesse useEffect é que ele é chamado toda vez que o componente for renderizado, e toda vez que ele for renderizado, ele adiciona o setState na lista de listeners, e retorna uma função que remove o setState da lista de listeners. Isso é feito para que o setState seja chamado toda vez que o estado global for alterado.
        
        if(shouldListen){
            listeners.push(setState);
        }

        return () => {
            if(shouldListen){
                listeners = listeners.filter(li => li !== setState);
            }
        };
    }, [setState, shouldListen]);

    return [globalState, dispatch];
}

export function initStore(userActions, initialState) {
    if (initialState) {
        globalState = { ...globalState, ...initialState };
    }
    actions = { ...actions, ...userActions };

}