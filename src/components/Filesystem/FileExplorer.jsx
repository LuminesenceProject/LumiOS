import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import Button from "../../util/Button";
import virtualFS from "./VirtualFS";
import { faPencil, faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";

const FileExplorer = ({ openApp, openWindowWithContent }) => {
  const [currentDir, setCurrentDir] = useState("");
  const [currentFolder, setCurrentFolder] = useState([]);
  const [currentFolderValues, setCurrentFolderValues] = useState({});
  const [selectedItem, setSelectedItem] = useState("");
  
  useEffect(() => {
    const updateCurrentFolder = async () => {
      try {
        const folderContent = await virtualFS.readdir(currentDir);
        if (!folderContent || typeof folderContent !== "object") {
          // Handle cases where folderContent is not an object
          console.error("Folder content is not an object:", folderContent);
          setCurrentFolder([]);
          setCurrentFolderValues({});
          return;
        }
  
        const objectFolderContent = Object.keys(folderContent);
        setCurrentFolder(objectFolderContent);
        setCurrentFolderValues(folderContent);
      } catch (error) {
        console.error("Error reading directory:", error);
        setCurrentFolder([]);
        setCurrentFolderValues({});
      }
    };
  
    updateCurrentFolder();
  }, [currentDir]);
  
  const getSidebarContent = () => {
    if (!virtualFS.root) return null;
  
    return Object.keys(virtualFS.root).map((folderName, index) => (
      <div key={index} onClick={() => setCurrentDir(`/${folderName}`)} className="bg-primary-light flex flex-row items-center rounded p-1 px-2 cursor-pointer shadow-sm font-bold hover:shadow transition-shadow duration-200">
        {folderName}
      </div>
    ));
  };
  
  const handleAddFolder = async () => {
    const newFolderName = prompt("Enter the folder name:");
    if (newFolderName) {
      try {
        let fileExists = false;
  
        // Check if the file already exists
        if (currentFolder.includes(newFolderName)) {
          fileExists = true;
        }
  
        if (!fileExists) {
          // File does not exist, create it
          await virtualFS.writeFolder(currentDir.replace("/", ""), newFolderName);
          const folderContent = await virtualFS.readdir(currentDir);

          setCurrentFolder(Object.keys(folderContent));
        } else {
          console.error("Folder already exists:", newFolderName);
        }
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };
  
  const handleAddFile = async () => {
    const newFileName = prompt("Enter the file name:");
    if (newFileName) {
      try {
        let fileExists = false;
  
        // Check if the file already exists
        if (currentFolder.includes(newFileName)) {
          fileExists = true;
        }
  
        if (!fileExists) {
          // File does not exist, create it
          await virtualFS.writeFile(currentDir.replace("/", ""), newFileName, "");
          const folderContent = await virtualFS.readdir(currentDir);

          setCurrentFolder(Object.keys(folderContent));
        } else {
          console.error("File already exists:", newFileName);
        }
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };  
    
  const handleItemClick = async (itemName) => {
    const itemPath = `${currentDir}/${itemName}`;
    const file = currentFolderValues[itemName];

    try {
      switch (file.type) {
        case "file": {
          openWindowWithContent(itemName, file.content);
          break;
        }
        case "folder": {
          setCurrentDir(itemPath);
          setSelectedItem("");
          break;
        }
        case "app": {
          openApp(itemName);
          break;
        }
        case "system": {
          openWindowWithContent(itemName, file.content);
          break;
        }
        default: {
          setCurrentDir("");
          openWindowWithContent(itemName, file.content);
        }
      }
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };  

  const handleInputChange = (event) => {
    event.preventDefault();
    
    const value = event.target.value;

    setCurrentDir(value);
  }

  const handleBackButton = () => {
    setSelectedItem("");
    if (currentDir === "root") return;
    // Remove trailing slash from currentDir if it exists
    const updatedDirectory = currentDir.endsWith("/") ? currentDir.slice(0, -1) : currentDir;

    // Split and slice to get the updated directory
    const parts = updatedDirectory.split("/");
    if (parts.length > 1) {
      const finalDirectory = parts.slice(0, -1).join("/");
      setCurrentDir(finalDirectory);
    }
  }

  const handleCopy = async () => {
    const newPath = prompt("New path");

    if (!newPath) return;

    await virtualFS.mv(currentDir, newPath, selectedItem);
    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  }

  const handleRename = async () => {
    const newName = prompt("New name");

    if (!newName) return;

    await virtualFS.mv(currentDir, currentDir, selectedItem, newName);
    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  }

  const handleDelete = async () => {
    await virtualFS.deleteFile(currentDir, selectedItem);

    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  }

  return (
    <div className="flex flex-row relative w-full h-full overflow-hidden">
      <div className="w-1/4 h-full flex flex-col gap-2 p-4 sticky top-0">
        <h2 className="font-bold">Folders</h2>
        {getSidebarContent()}
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-bold">{currentDir || "Root"}</h2>
          <Button onClick={handleBackButton}>Back</Button>
          {/*
          <form onSubmit={handleInputChange}>
            <input className="flex-grow" defaultValue={currentDir} onSubmit={handleInputChange} />
          </form>
          */}
        </div>
        <div className={`flex flex-row items-center justify-between gap-2 my-1 `}>
          <div style={{ color: !selectedItem ? "gray" : "" }} className={`flex flex-row items-center gap-2 ${!selectedItem ? "cursor-not-allowed pointer-events-none" : "cursor-pointer pointer-events-auto"}`}>
            <FontAwesomeIcon icon={faCopy} onClick={handleCopy} />
            <FontAwesomeIcon icon={faPencil} onClick={handleRename} />
            <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
          </div>
          <div className="group relative">
            <Button className="group-active:scale-100">New <FontAwesomeIcon icon={faPlusCircle} /></Button>
            <div className="absolute flex flex-col gap-1 scale-0 group-active:scale-100 group-hover:scale-100 origin-top duration-200 transition-transform bg-secondary-light p-1 shadow">
              <Button onClick={handleAddFile} className="">File</Button>
              <Button onClick={handleAddFolder}>Folder</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {currentFolder.map((itemName, index) => (
            <div onDoubleClick={() => handleItemClick(itemName)} key={index} className="bg-primary-light flex flex-row items-center rounded p-1 cursor-pointer shadow-sm hover:shadow transition-shadow duration-200" onClick={() => setSelectedItem(itemName)}>
              {currentFolderValues[itemName]?.type?.includes("folder") ? <FontAwesomeIcon icon={faFolder} /> : <FontAwesomeIcon icon={faFile} />}
              <div className="flex flex-row items-center justify-between px-2 w-full">
                <span>
                {itemName}
                </span>
                <div style={{ color: "gray" }} className="flex flex-row">
                  {currentFolderValues[itemName].type}
                  {currentFolderValues[itemName]?.fileType !== currentFolderValues[itemName].type && <div className="pl-1">{currentFolderValues[itemName]?.fileType}</div>}    
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;