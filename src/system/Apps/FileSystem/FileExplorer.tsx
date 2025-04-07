import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faFile, faFolder, } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowUpFromBracket, faChevronDown, faChevronRight, faFileDownload, faFilePen, faMagnifyingGlassPlus, faPencil, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContextMenu } from "../../ContextMenu/useContextMenu";
import ContextMenu from "../../ContextMenu/ContextMenu";
import Button from "../../../structures/Button";
import virtualFS from "../../../utils/VirtualFS";
import { saveStamp } from "../../../structures/Timestamp";
import { useTopbar } from "../../Topbar/useTopbar";
import { File } from "../../../utils/types";

interface FileExplorerProps {
  prePath: string;
  setPrompts: (prev: any[]) => void;
  setOpenedApps: (prev: string[]) => void;
  setCustomWindowContent: (prev: null[]) => void;
  setHtmlCustomWindowContent: (prev: null[]) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ prePath, setPrompts, setOpenedApps, setCustomWindowContent, setHtmlCustomWindowContent }) => {
  const [currentDir, setCurrentDir] = useState<string>(prePath || "");  
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const [currentFolder, setCurrentFolder] = useState<string[]>([]);
  const [currentFolderValues, setCurrentFolderValues] = useState({});
  const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { menuVisible, menuActions, dropDownActions, showMenu, hideMenu } = useContextMenu();
  const { addMenu, removeMenu } = useTopbar();

  const inputRef = useRef<HTMLInputElement>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [canViewSystem, setCanViewSystem] = useState<boolean>(false);

  const updateCurrentFolder = async () => {
    try {
      const folderContent = await virtualFS.readdir(currentDir);
      if (!folderContent || typeof folderContent !== "object") {
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

  useEffect(() => {
    updateCurrentFolder();
  }, [currentDir]);

  useEffect(() => {
    const menu = {
      title: "Files",
      dropdown: [
        { label: 'File', onClick: handleAddFile, icon: faPlusCircle },
        { label: 'Folder', onClick: handleAddFolder, icon: faPlusCircle, gap: true },
        { label: 'Upload', onClick: handleFileUpload, icon: faFileDownload },
      ],
    };

    let selectedItemMenu: any;

    if (selectedItem) {
      const itemMenu = {
        title: "Item",
        dropdown: [
          { label: "Copy", onClick: handleCopy, icon: faCopy },
          { label: "Rename", onClick: handleRename, icon: faPencil },
          { label: "Delete", onClick: handleDelete, icon: faTrash },
          { label: "View", onClick:  handleView, icon: faMagnifyingGlassPlus },
          { label: "Edit", onClick:  handleEdit, icon: faFilePen },
        ],
      };

      selectedItemMenu = itemMenu;
    }

    setTimeout(() => {
      addMenu(menu);

      if (selectedItemMenu) {
        addMenu(selectedItemMenu);
      }
    }, 0);

    return () => {
      removeMenu("Files");
      removeMenu("Item");
    };
  }, [selectedItem]);

  useEffect(() => {
    const fetchCanViewSystem = async () => {
      const file = await virtualFS.readfile("System", "ViewSystemFiles");

      const value: boolean = JSON.parse(file.content) || false;

      if (value) {
        setCanViewSystem(value);
      }
    };

    fetchCanViewSystem();
  }, []);

  const handleSidebarChange = (name: string) => {
    setCurrentDir(`/${name}`);
    setSelectedItem("");
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = `/${name}`;
    }

    saveStamp({
      app: "FileExplorer",
      content: {
        name: name,
        directory: currentDir,
      },
      openedApps: [],
    });
  };

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prevState => ({
      ...prevState,
      [folderName]: !prevState[folderName],
    }));
  };

  const renderFolderChildren = (folder: any, parent: string) => {
    return Object.keys(folder.children).filter((name) => !name.includes("System")).map((childName, index) => (
      <div key={index} className="pl-4">
        {folder.children[childName].type === 'folder' ? (
          <>
            <div className="flex flex-row items-center">
              <div
                className={`hover:bg-secondary-light flex flex-row items-center rounded p-1 px-2 cursor-pointer font-bold hover:shadow transition-all duration-200 w-full ${currentDir.includes(childName) && "bg-secondary-light"}`}
              >
                <FontAwesomeIcon
                  icon={openFolders[childName] ? faChevronDown : faChevronRight}
                  onClick={() => toggleFolder(childName)}
                  className="cursor-pointer pr-1"
                />
                <span className="w-full" onClick={() => handleSidebarChange(`${parent}/${childName}/`)}>
                  {childName}
                </span>
              </div>
            </div>
            {openFolders[childName] && renderFolderChildren(folder.children[childName], childName)}
          </>
        ) : (
          <div
            className="hover:bg-secondary-light flex flex-row items-center rounded p-1 px-2 cursor-pointer transition-all duration-200"
          >
            {childName}
          </div>
        )}
      </div>
    ));
  };

  const getSidebarContent = (): JSX.Element[] | null => {
    if (!virtualFS.root) return null;

    return Object.keys(virtualFS.root.children).filter(name => !canViewSystem ? !name.includes("System") : true).map((folderName, index) => (
      <div key={index}>
        <div className="flex flex-row items-center">
          <div
            className={`hover:bg-secondary-light w-full flex flex-row items-center rounded p-1 px-2 cursor-pointer font-bold hover:shadow transition-all duration-200 ${currentDir.includes(folderName) && "bg-secondary-light"}`}
          >
            <FontAwesomeIcon
              icon={openFolders[folderName] ? faChevronDown : faChevronRight}
              onClick={() => toggleFolder(folderName)}
              className="cursor-pointer pr-1"
            />
            <span onClick={() => handleSidebarChange(folderName)} className="w-full">
              {folderName}
            </span>
          </div>
        </div>
        {openFolders[folderName] && renderFolderChildren(virtualFS.root.children[folderName], folderName)}
      </div>
    ));
  };

  const handleAddFolder = async (): Promise<void> => {
    const newFolderName = prompt("Enter the folder name:");
    if (newFolderName) {
      try {
        let fileExists = false;

        if (currentFolder.includes(newFolderName)) {
          fileExists = true;
        }

        if (!fileExists) {
          await virtualFS.writeFolder(currentDir.replace("/", ""), newFolderName);
          const folderContent = await virtualFS.readdir(currentDir);

          setCurrentFolder(Object.keys(folderContent));
        } else {
          console.error("Folder already exists:", newFolderName);
        }

        saveStamp({
          app: "FileExplorer",
          content: {
            name: newFolderName,
            directory: currentDir,
            exists: fileExists,
          },
          openedApps: [],
        });
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };

  const handleAddFile = async (): Promise<void> => {
    const newFileName = prompt("Enter the file name:");
    if (newFileName) {
      try {
        let fileExists = false;

        if (currentFolder.includes(newFileName)) {
          fileExists = true;
        }

        if (!fileExists) {
          enum AllowedFileTypes {
            TXT = "txt",
            JPG = "jpg",
            HTML = "html",
            SHRT = "shrt",
            PINN = "pinn",
            APP = "app",
            JS = "js",
          }
          
          const newFileTypeInput = prompt(`File type? Options: ${Object.values(AllowedFileTypes).join(", ")}`);

          // Check if the input is a valid file type
          const newFileType: AllowedFileTypes | undefined = Object.values(AllowedFileTypes).includes(newFileTypeInput as AllowedFileTypes)
            ? newFileTypeInput as AllowedFileTypes
            : undefined;

          if (!newFileType) return alert("Not allowed file type.");
        
          await virtualFS.writeFile(currentDir, newFileName, "", newFileType);
          await updateCurrentFolder();
        } else {
          alert("File already exists.");
          console.error("File already exists:", newFileName);
        }
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };

  const handleFileUpload = async (): Promise<void> => {
    const newFileName = prompt("Enter the file name:");
    if (newFileName) {
      try {
        let fileExists = false;

        if (currentFolder.includes(newFileName)) {
          fileExists = true;
        }

        if (!fileExists) {
          let input = document.createElement("input");
          input.type = "file";

          input.onchange = () => {
            let file = input.files?.[0];
            
            if (!file) return;

            let reader = new FileReader();

            reader.readAsText(file, "UTF-8");
            reader.onload = async (event) => {
              const newFile = event.target?.result as string;
              const fileType = file.type.replace("text/", "") || "txt";
              
              await virtualFS.writeFile(currentDir.replace("/", ""), newFileName, newFile, fileType);
              const folderContent = await virtualFS.readdir(currentDir);
              setCurrentFolder(Object.keys(folderContent));
              setCurrentFolderValues(folderContent);

              saveStamp({
                app: "FileExplorer",
                content: {
                  name: newFileName,
                  type: fileType,
                },
                openedApps: [],
              });
            };
          };

          input.click();
        } else {
          alert("File already exists.");
          console.error("File already exists:", newFileName);
        }
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };

  const handleItemClick = async (itemName: string): Promise<void> => {
    const itemPath = `${currentDir}/${itemName}`;
    const file = currentFolderValues[itemName];

    try {
      switch (file.type) {
        case "file": {
          if (["app", "html", "shrt", "pinn"].includes(file.fileType)) {
            setOpenedApps((prev: string[]) => [...prev, itemName]);
          } else {            
            setCustomWindowContent((prev) => [...prev, { title: itemName, content: file.content, path: currentDir }]);
          }
          break;
        }
        case "folder": {
          setCurrentDir(itemPath);
          setSelectedItem("");
          setInput("");
          inputRef.current.value = itemPath;
          break;
        }
        default: {
          setCurrentDir("");
        }
      }
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };

  const handleBackButton = (): void => {
    setSelectedItem("");
    if (currentDir === "root") return;

    const updatedDirectory = currentDir.endsWith("/") ? currentDir.slice(0, -1) : currentDir;
    const parts = updatedDirectory.split("/");
    if (parts.length > 1) {
      const finalDirectory = parts.slice(0, -1).join("/");
      setCurrentDir(finalDirectory);
      inputRef.current!.value = finalDirectory;
    }
  };

  const handleCopy = async (): Promise<void> => {
    const newPath = prompt("New path");

    saveStamp({
      app: "FileExplorer",
      content: {
        command: "copy",
        selectedItem: selectedItem,
        currentDir: currentDir,
        newPath: newPath ? newPath : "No path was selected.",
        file: currentFolderValues[selectedItem],
      },
      openedApps: [],
    });

    if (!newPath) return;

    await virtualFS.mv(currentDir, newPath, selectedItem);
    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  };

  const handleRename = async (): Promise<void> => {
    const newName = prompt("New name");

    saveStamp({
      app: "FileExplorer",
      content: {
        command: "rename",
        selectedItem: selectedItem,
        currentDir: currentDir,
        newPath: newName ? newName : "No path was selected.",
        file: currentFolderValues[selectedItem],
      },
      openedApps: [],
    });

    if (!newName) return;

    await virtualFS.mv(currentDir, currentDir, selectedItem, newName);
    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  };

  const handleDelete = async (): Promise<void> => {
    const file: File = currentFolderValues[selectedItem];

    delete file.content;

    saveStamp({
      app: "FileExplorer",
      content: {
        command: "handleCopy",
        selectedItem: selectedItem,
        currentDir: currentDir,
        file: file,
      },
      openedApps: [],
    });

    if (!file?.permissions || !["sys", "theme"].some(value => file?.fileType.includes(value))) {
      await virtualFS.deleteFile(currentDir, selectedItem);
    } else {
      const handleFileConfirm = async (currentDir: any, selectedItem: any) => {
        await virtualFS.deleteFile(currentDir, selectedItem);
        setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));

      }

      // @ts-ignore
      setPrompts((prev: any) => [...prev, { title: `Delete ${selectedItem}?`, description: "Are you sure you want to permenately delete this item?", onConfirm: async () => await handleFileConfirm(currentDir, selectedItem), game: undefined }])
      setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    }

    setCurrentFolder(Object.keys(await virtualFS.readdir(currentDir)));
    setSelectedItem("");
  };

  const handleEdit = () => {
    setCustomWindowContent((prev) => [...prev, { title: selectedItem, content: currentFolderValues[selectedItem].content, path: currentDir }]);
    setSelectedItem("");
  };

  const handleView = () => {
    setHtmlCustomWindowContent((prev) => [...prev, { title: selectedItem, content: currentFolderValues[selectedItem].content, path: currentDir }]);
    setSelectedItem("");
  };

  const handleFileContextmenu = async (event: React.MouseEvent<HTMLDivElement>, name: string) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    const rect = document.getElementById("fileexplorer");
    const bounds = rect?.getBoundingClientRect();

    if (bounds) {
      const relativeX = x - bounds.left;
      const relativeY = y - bounds.top - 75;
      setUpdatedMenuPosition({ x: relativeX, y: relativeY });
    }

    const itemPath = `${currentDir}/${name}/`;
    const file = currentFolderValues[name];

    showMenu(event, name, {
      "Navigate": async () => {
        if (file.type !== "folder") return hideMenu();
        setCurrentDir(itemPath);
        hideMenu();
      },
      "Open": () => {
        handleItemClick(name);
        hideMenu();
      },
      "Copy": () => {
        handleCopy();
        hideMenu();
      },
      "Rename": () => {
        handleRename();
        hideMenu();
      },
      "Delete": () => {
        handleDelete();
        hideMenu();
      },
    }, {
      "Viewer": () => {
        handleView();
        hideMenu();
      },
      "Editor": () => {
        handleEdit();
        hideMenu();
      },
    });

    event.stopPropagation();
  };

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentDir(e.currentTarget.value);
      if (currentDir !== e.currentTarget.value) {
        setSelectedItem("");
      }
    }
  };

  const handleInputChange = (e: string) => {
    setInput(e);
    if (selectedItem !== "" && !selectedItem.includes(e)) {
      setSelectedItem("");
    }
  };

  return (
    <div className="flex flex-row relative w-full h-full overflow-hidden" id="fileexplorer">
      <div className="w-2/5 max-w-[250px] h-full flex flex-col gap-2 p-1 sticky top-0 bg-secondary overflow-auto overflow-y-scroll overflow-x-hidden">
        <h2 className="font-bold px-2 py-2">Favorites</h2>
        {getSidebarContent()}
      </div>
      <div className="flex-grow p-4 overflow-y-scroll">
        <div className="flex flex-row items-center justify-between">
          <input onKeyUp={(e) => handleInput(e)} defaultValue={currentDir === "" ? "Root" : currentDir} ref={inputRef} className="[all:unset] text-ellipsis overflow-hidden whitespace-nowrap" />
          <Button onClick={handleBackButton}>Back</Button>
        </div>
        <div className={`flex flex-row items-center justify-between gap-2 my-1 `}>
          <div style={{ color: !selectedItem ? "gray" : "" }} className={`flex flex-row items-center gap-2 ${!selectedItem ? "cursor-not-allowed pointer-events-none" : "pointer-events-auto"}`}>
            <div className="hover:bg-primary-light transition-all duration-200 hover:shadow-sm rounded p-1 cursor-pointer">
              <FontAwesomeIcon icon={faCopy} onClick={handleCopy} />
            </div>
            <div className="hover:bg-primary-light transition-all duration-200 hover:shadow-sm rounded p-1 cursor-pointer">
              <FontAwesomeIcon icon={faPencil} onClick={handleRename} />
            </div>
            <div className="hover:bg-primary-light transition-all duration-200 hover:shadow-sm rounded p-1 cursor-pointer">
              <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
            </div>
          </div>
          <div className="flex-grow">
            <input className="input-main mx-2 my-2" placeholder="Search..." onChange={(e) => handleInputChange(e.target.value)} />
          </div>
          <div className="group relative ml-2">
            <Button className="group-active:scale-100 flex flex-row w-20">New <FontAwesomeIcon icon={faPlusCircle} /></Button>
            <div className="absolute flex flex-col gap-1 scale-0 group-active:scale-100 group-hover:scale-100 origin-top duration-200 transition-transform bg-secondary-light p-1 shadow">
              <Button onClick={handleAddFile}>File</Button>
              <Button onClick={handleFileUpload}>Upload</Button>
              <Button onClick={handleAddFolder}>Folder</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between items-center" style={{ color: "gray" }}> 
            <h2>Name</h2>
            <h2>Type</h2>
          </div>
          <hr className="rounded mb-2" style={{ color: "gray" }} />
          {currentFolder.filter(value => value.toLocaleLowerCase().includes(input.toLocaleLowerCase()) && !canViewSystem ? !value.includes("System") : true).map((itemName, index) => (
            <div onContextMenu={(e) => handleFileContextmenu(e, itemName)} onClick={() => setSelectedItem(itemName)} onDoubleClick={() => handleItemClick(itemName)} key={index} className={`hover:bg-primary-light flex flex-row items-center rounded p-1 cursor-pointer hover:shadow transition-all duration-200 ${selectedItem === itemName && "bg-primary-light"}`}>
              {currentFolderValues[itemName]?.type?.includes("folder") ? <FontAwesomeIcon icon={faFolder} /> : <FontAwesomeIcon icon={faFile} />}
              <div className="flex flex-row items-center justify-between px-2 w-full">
                <span>
                  {itemName}
                </span>
                <div style={{ color: "gray" }} className="flex flex-row">
                  {currentFolderValues[itemName]?.type}
                  {currentFolderValues[itemName]?.fileType !== currentFolderValues[itemName]?.type && <div className="pl-1">{currentFolderValues[itemName]?.fileType}</div>}
                </div>
              </div>
            </div>
          ))}
          {Object.keys(currentFolder).length == 0 && <h4 className="font-semibold text-md text-center">{currentDir.replace("/", "").slice(0, 1).toUpperCase() + currentDir.replace("/", "").slice(1, currentDir.length)} is empty.</h4>}
        </div>
      </div>
      {menuVisible && (
        <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} menuDropdown={dropDownActions} dropDownName="Open With" emojis={[faArrowLeft, faArrowUpFromBracket, faCopy, faPencil, faTrash, faMagnifyingGlassPlus, faFilePen]} />
      )}
    </div>
  );
};

export default FileExplorer;