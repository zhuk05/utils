import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useCodeStore} from "@/stores/CodeStore";

/** @typedef Bind
 * @property {number} numKey
 * @property {string} symbol
 * @property {string} htmlEntity
 * @property {number} id
 */

export const useSymbolBind = defineStore('symbolBind', () => {
    const codeStore = useCodeStore();

    /** @type {Bind[]} */
    const binds = ref([]);
    let incID = 0;

    const getBinds = computed(() => binds.value)
    const isMac = computed(() => codeStore.isMac)

    /**
     * @param {string} htmlEntity
     * @param {string} symbol
     * */
    const pushSymbol = (htmlEntity, symbol) => {

        if(binds.value.length < 10 && codeStore.getInstance()) {
            const newBind = {
                numKey: (binds.value.length + 1) % 10,
                symbol,
                htmlEntity,
                id: incID++
            }
            binds.value.push(newBind);
            codeStore.getInstance().commands.addCommand(createCommand(newBind))
        }
    }

    /** @param {number} id */
    const deleteBind = (id) => {
        const bindIndex = binds.value.findIndex((bind) => bind.id === id)
        if(bindIndex < 0)
            return;
        binds.value.splice(bindIndex, 1);
        reBind()
    }

    const clearBinds = () => {
        binds.value = []
        clearNumberBinds()
    }

    /**
     * Change Bind.numKey from binds, and rebind keys
     * in Ace editor
     */
    const reBind = () => {
        clearNumberBinds()

        binds.value.forEach((b, i) => {
            b.numKey = (i + 1) % 10;
            codeStore.getInstance().commands.addCommand(createCommand(b));
        });
    }

    const clearNumberBinds = () => {
        let key = ""
        const bindings =  codeStore.getInstance().keyBinding.$defaultHandler.commandKeyBinding
        for (let i = 1; i <= 10; i++) {
            key = "cmd-" + (i % 10);
            if (key in bindings)
                delete bindings[key];
            key = "ctrl-" + (i % 10);
            if(key in bindings)
                delete bindings[key];
        }
    }

    /** @param {KeyboardEvent} keyEvent */
    const bind = (keyEvent) => {
        if(((isMac.value && keyEvent.metaKey) || keyEvent.ctrlKey ) && keyEvent.code.startsWith("Digit")) {
            keyEvent.stopPropagation()
            keyEvent.preventDefault()
        }
    }

    window.addEventListener("keydown", bind)
    window.addEventListener("keyup", bind)

    return {
        binds,
        getBinds,
        isMac,
        pushSymbol,
        deleteBind,
        clearBinds
    }
})

/** @param {Bind} bind
 * @return {Command}
 * */
function createCommand(bind) {
    return {
        name: bind.symbol,
        bindKey: {
            win: "Ctrl-" + bind.numKey,
            mac: "Command-" + bind.numKey
        },
        exec: function(editor) { editor.insert(bind.symbol); },
        scrollIntoView: "cursor"
    }
}