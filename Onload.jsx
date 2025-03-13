import { useEffect, useRef, useState } from 'react';

const Onload = () => {
    const [text, setText] = useState("");
    const textareaRef = useRef();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        // check for current user script, then set it

        if (localStorage.getItem(currentUser.name + "-onload-script")) {
            textareaRef.current.value = localStorage.getItem(currentUser.name + "-onload-script");
        }
    }, [])

    const handleSaveCode = () => {
        const code = textareaRef.current.value;

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        localStorage.setItem(currentUser.name + "-onload-script", code);
        setText("Saved code to localstorage!");
    };

    const handleOpenFile = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.js';
        fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
            const code = readerEvent.target.result;
            textareaRef.current.value = code;
            };
            reader.readAsText(file);
        } else {setText("No file was selected.")}
        });
        fileInput.click();
    };

    return (
        <div className="flex flex-col w-full h-full justify-center items-start p-2">
            <div className="flex text-xs py-2">
                <button className="button-main mx-4" onClick={handleSaveCode}>
                Save Code
                </button>
                <button className="button-main mx-4" onClick={handleOpenFile}>
                Open File
                </button>
            </div>
            {text && (
                <p className="text-sm font-bold">{ text }</p>
            )}
            <div className="w-full h-full flex-grow">
                <div className="w-full h-full overflow-hidden">
                    <div class="relative w-full text-text-base">
                        <textarea
                        ref={textareaRef}
                        className="peer bg-primary-light h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" ">
                        </textarea>
                        <label
                        style={{ borderColor: "black" }}
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Outlined
                        </label>
                    </div>                
                </div>
            </div>
        </div>
    );
};

export default Onload;