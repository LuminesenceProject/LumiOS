import { faArrowLeft, faFile, faFolder, faTimes } from "@fortawesome/free-solid-svg-icons";
import Draggable from "react-draggable";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import virtualFS from "../utils/VirtualFS";
import { Stamp } from "../utils/types";
import { saveStamp } from "./Timestamp";
import { File, Folder } from "../utils/types";

interface FilePromptProps {
    setPath: (prev: string) => void;
    setPrompts: (prev: any) => void;
    setFile: (prev: any) => void;
    currentFilePrompt: string;
}

const FilePrompt: React.FC<FilePromptProps> = ({ setPath, setPrompts, currentFilePrompt, setFile }) => {
    const [currentDir, setCurrentDir] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [folderContent, setFolderContent] = useState<Record<string, File | Folder>>({});
    
    useEffect(() => {        
        const fetchContent = async (): Promise<void> => {
            try {
                const content = await virtualFS.readdir(currentDir);
                setFolderContent(content);
                setPath(currentDir);
            } catch (error) {
                console.error(error);
            }
        }

        fetchContent();
    }, [currentDir]);

    useEffect(() => {
        console.log(currentFilePrompt);
        
    }, [currentFilePrompt]);

    const handleItemClick = (item: string) => {
        const file = folderContent[item] as File | Folder;
        console.log(currentFilePrompt);
        

        //if (file.type === "file" && currentFilePrompt === "Folder") return;

        // Assuming file is of type File | Folder
        let folderChildren: boolean = file.type === "folder" ? 
            Object.keys((folderContent[item] as Folder).children).some(thing => 
                (folderContent[item] as Folder).children[thing].type === "folder"
            ) 
        : false;

        if (currentFilePrompt === "Folder") {
            if (folderChildren) {
                const newPath = `${currentDir}/${item}`;
                setCurrentDir(newPath);
                setPath(currentDir);
            } else {
                setSelectedItem(item);
                setPath(`${currentDir}/${item}`);
            }
        } else {
            if (file.type === "folder") {
                const newPath = `${currentDir}/${item}`;
                setCurrentDir(newPath);
                setPath(currentDir);
            } else {
                setSelectedItem(item);
            }
            console.log(item, "FILE");
            
        }

        // stamp here
        const stamp: Stamp = {
            app: "FilePrompt",
            content: file,
            openedApps: [],
        };

        saveStamp(stamp);

        setFile(file);
    }

    const handleSingleClick = (item: string) => {
        const file = folderContent[item];

        if (file.type === "file") return;

        const newPath = `${currentDir}/${item}`;
        setSelectedItem(item);
        setPath(newPath);
        setFile(file);
    }

    const handleBack = () => {
        if (currentDir === "root") return;
    
        const updatedDirectory = currentDir.endsWith("/") ? currentDir.slice(0, -1) : currentDir;
        const parts = updatedDirectory.split("/");
        if (parts.length > 1) {
          const finalDirectory = parts.slice(0, -1).join("/");
          setCurrentDir(finalDirectory);
          setPath(finalDirectory);
        } else {
          setCurrentDir("");
          setPath("");
        }
    }

    const handleConfirm = () => {
        setPrompts(false);
    }

    const handleFolder = async (): Promise<void> => {
        if (currentDir === "root") return;
        const newFolderName = String(prompt("Folder name?"));

        if (!newFolderName) return;

        if (selectedItem) 

        await virtualFS.writeFolder(currentDir, newFolderName);
        const content = await virtualFS.readdir(currentDir);
        setFolderContent(content);
        setPath(currentDir);
    }

    return ( 
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 backdrop-blur-lg text-text-base">
            <Draggable>
                <div className="flex flex-col items-center bg-primary rounded shadow-lg min-h-[200px] w-1/2">
                    <div className="bg-primary-light w-full py-1 px-2 flex justify-between items-center rounded cursor-move">
                        <h2 className="font-bold text-2xl">Choose a path:</h2>
                        <Button onClick={() => setPrompts(false)}><FontAwesomeIcon icon={faTimes} /></Button>
                    </div>
                    <div className="flex flex-col gap-1 my-2 px-2 justify-center items-center h-full w-full">
                        <div className="flex flex-row w-full justify-between items-center">
                            {currentDir === "" ? "Root/" : currentDir}
                            <Button onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} />Back</Button>
                        </div>
                        {Object.keys(folderContent).map((item, index) => (
                            <div key={index} onClick={() => handleSingleClick(item)} onDoubleClick={() => handleItemClick(item)} className={`bg-primary-light ${selectedItem === item && "!bg-secondary"} w-full flex flex-row items-center rounded p-1 cursor-pointer shadow-sm hover:shadow transition-shadow duration-200`}>
                                {folderContent[item]?.type?.includes("folder") ? <FontAwesomeIcon icon={faFolder} /> : <FontAwesomeIcon icon={faFile} />}
                                <div className="flex flex-row items-center justify-between px-2 w-full">
                                    <span>
                                        {item}
                                    </span>
                                    <div style={{ color: "gray" }} className="flex flex-row">
                                        {folderContent[item].type}
                                        {folderContent[item].type === "file" && folderContent[item].fileType !== folderContent[item].type && <div className="pl-1">{folderContent[item]?.fileType}</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <Button onClick={handleFolder}>New Folder</Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}
 
export default FilePrompt;