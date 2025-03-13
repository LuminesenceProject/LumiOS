import React, { useRef } from "react";

const Notepad = () => {
  const textarea = useRef(null);

  const newFile = async () => {
    try {
      const handle = await window.showSaveFilePicker();
      const writable = await handle.createWritable();
      await writable.write(textarea.current.value);
      await writable.close();
    } catch (error) {
      console.error('Error creating new file:', error);
    }
  }  
  
  const saveAs = () => {
    const content = textarea.current.value;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "untitled.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const open = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      textarea.current.value = reader.result;
    };
  
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col text-text-base h-full">
        <div className="flex text-xs py-2">
            <div className="group">
              <button className="button-main">File</button>
              <div className="absolute flex flex-col gap-2 bg-secondary-light scale-0 transition-transform duration-200 origin-top group-active:scale-100 hover:scale-100 p-1 rounded">
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={newFile}>New File</button>
                <button htmlFor="file-input" className="transition-colors duration-200 hover:bg-secondary p-2 rounded cursor-pointer">Open</button>
                <input id="file-input" type="file" onChange={open} style={{ display: "none" }} />
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={saveAs}>Save as</button>
              </div>
            </div>
            <div className="mx-2 group">
              <button className="button-main">View</button>
              <div className="absolute flex flex-col gap-2 bg-secondary-light scale-0 transition-transform duration-200 origin-top group-active:scale-100 hover:scale-100 p-1 rounded">
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => {}}></button>
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => {}}></button>
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => {}}></button>
              </div>
            </div>
        </div>
        <textarea ref={textarea} className="flex-grow h-full w-full" />
    </div>
  );
};

export default Notepad;