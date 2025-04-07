import React, { useEffect, useRef, useState } from "react";
import virtualFS from "../../../../utils/VirtualFS";
import { File } from "../../../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faFileExport, faFolderOpen, faPlay } from "@fortawesome/free-solid-svg-icons";

interface NotepadProps {
  setShowFilePrompt: (prev: boolean) => void;
  setCurrentFilePrompt: (prev: string) => void;
  filePrompt: boolean;
  currentDir: string;
  file: File | unknown;
  content?: string;
}

const Notepad: React.FC<NotepadProps> = ({ setShowFilePrompt, setCurrentFilePrompt, filePrompt, currentDir, file, content }) => {
  const textarea = useRef(null);
  const [type, setType] = useState<string>("");
  
  useEffect(() => {
    const handleVariableChange = async (): Promise<void> => {
      if (!filePrompt) {
        switch (type) {
          case "saveas": {
            setCurrentFilePrompt("Folder");

            enum AllowedFileTypes {
              TXT = "txt",
              JPG = "jpg",
              HTML = "html",
              SHRT = "shrt",
              PINN = "pinn",
              APP = "app",
            }
            
            const newFileName = String(prompt("File name?"));
            const newFileTypeInput = prompt(`File type? Options: ${Object.values(AllowedFileTypes).join(", ")}`);

            // Check if the input is a valid file type
            const newFileType: AllowedFileTypes | undefined = Object.values(AllowedFileTypes).includes(newFileTypeInput as AllowedFileTypes)
              ? newFileTypeInput as AllowedFileTypes
              : undefined;

            if (!newFileName || !newFileType) return;
            
            await virtualFS.writeFile(currentDir, newFileName, textarea.current.value, newFileType);            
            break;
          };
          case "open": {
            setCurrentFilePrompt("File");
            
            if (file) {
              textarea.current.value = file.content;
            }

            break;
          }
          case "save": {            
            setCurrentFilePrompt("File");

            if (currentDir && file) {
              const folderContent = await virtualFS.readdir(currentDir);
              const actualFileName: string = Object.keys(folderContent).find(value => {
                console.log();
                
                return folderContent[value].content === file.content;
              });
              console.log(actualFileName, currentDir, file);
              
              await virtualFS.deleteFile(currentDir, actualFileName);
              await virtualFS.writeFile(currentDir, actualFileName, textarea.current.value, file.fileType);
            }

            break;
          }
          default: break;
        }
    }
  }

  handleVariableChange();
  }, [filePrompt, currentDir]);

  const open = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
  
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files) return;
  
      const file = target.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        // Assuming textarea.current is of type React.MutableRefObject<HTMLTextAreaElement | null>
        if (textarea.current) {
          textarea.current.value = reader.result as string;
        }
      };
  
      reader.readAsText(file);
    };
  };  

  const handleJavascript = () => {
    const codeToRun: string = textarea.current.value.trim();
    try {
      eval(codeToRun)
    } catch (error) {
      console.error(error);
    };
  };

  const handleWasm = async () => {
    //runWasm(textarea.current.value);
  };

  return (
    <div className="flex flex-row text-text-base h-full">
      <div className="flex flex-col relative"> {/* Added 'relative' positioning here */}
        <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => { setType("open"); setCurrentFilePrompt("File"); setShowFilePrompt(true); }}><FontAwesomeIcon icon={faFolderOpen} /></button>
        <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={open}><FontAwesomeIcon icon={faDownload} /></button>
        <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => { setType("save"); setCurrentFilePrompt("File"); setShowFilePrompt(true); }}><FontAwesomeIcon icon={faFile} /></button>
        <input id="file-input" type="file" onChange={open} style={{ display: "none" }} />
        <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => { setType("saveas"); setCurrentFilePrompt("Folder"); setShowFilePrompt(true); }}><FontAwesomeIcon icon={faFileExport} /></button>
        <div className="group w-full"> {/* No need for 'group-hover:scale-100' here */}
          <div className="absolute z-50 scale-0 group-hover:scale-100 transition-transform duration-200 translate-x-8 left-0 bg-primary rounded shadow-md"> {/* Adjust positioning and z-index */}
            <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={handleJavascript}><svg className="w-4 h-4 invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"/></svg></button>
            <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={handleWasm}><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000" className="w-4 h-4 invert"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>file_type_wasm</title><path d="M19.153,2.35V2.5a3.2,3.2,0,1,1-6.4,0h0V2.35H2V30.269H29.919V2.35Z"></path><path className="invert" d="M8.485,17.4h1.85L11.6,24.123h.023L13.14,17.4h1.731l1.371,6.81h.027l1.44-6.81h1.815l-2.358,9.885H15.329l-1.36-6.728h-.036l-1.456,6.728h-1.87Zm13.124,0h2.917l2.9,9.885H25.515l-.63-2.2H21.562l-.486,2.2H19.217Zm1.11,2.437-.807,3.627h2.512L23.5,19.832Z"></path></g></svg></button>
          </div>
          <button className="group-hover:scale-100 transition-colors duration-200 w-full hover:bg-secondary p-2 rounded"><FontAwesomeIcon icon={faPlay} /></button>
        </div>
      </div>
      <textarea ref={textarea} defaultValue={content} className="flex-grow h-full w-full p-2" />
    </div>
  );
};

export default Notepad;