export const openedApps: Array<string> = [];

export let currentUserIndex: number = 0;

export const changeUserIndex = (index: number) => {
    currentUserIndex = index;
}

export let secure: boolean = true;

export const changeSecure = (newValue: boolean) => {
    secure = newValue;
}

export const runWasm = async (wasm: ArrayBuffer) => {
    try {
        // Instantiate the WebAssembly module
        const wasmModule = await WebAssembly.instantiate(wasm, {});

        // Access the exports of the instantiated module
        const { instance } = wasmModule;
        const exports = instance.exports;

        // Example: Check if a specific function exists and call it
        if (exports.main && typeof exports.main === 'function') {
            const result = (exports.main as Function)();
            console.log(`Wasm function 'main' executed with result: ${result}`);
        } else {
            console.log('No callable function "main" found in the Wasm module.');
        }
    } catch (error) {
        console.error('Error instantiating or running the Wasm module:', error);
    }
};