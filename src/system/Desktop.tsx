import React, { useEffect, useState } from "react";
import { App, File, Folder } from "../utils/types";
import { useContextMenu } from "./ContextMenu/useContextMenu";
import virtualFS from "../utils/VirtualFS";
import Taskbar from "./Taskbar/Taskbar";
import Window from "../structures/Window";
import components from "./Apps/Components";
import ContextMenu from "./ContextMenu/ContextMenu";
import Prompt from "../structures/Prompt";
import Menu from "./Taskbar/Menu";
import Tray from "./Taskbar/Tray";
import HTMLFileViewer from "./Apps/HTML/HTMLFileViewer";
import startup from "../assets/sound/startup.wav";
import FilePrompt from "../structures/FilePrompt";
import BigSearch from "../structures/BigSearch";
import Notepad from "./Apps/OptionalApps/Notepad/Notepad";
import AppTray from "./Taskbar/AppTray";
import Assistant from "./Taskbar/Assistant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowUpFromBracket, faFile, faFileCirclePlus, faFilePen, faFolderClosed, faFolderPlus, faGear, faList, faMagnifyingGlassPlus, faMoon, faPaintBrush, faPenToSquare, faQuestionCircle, faRefresh, faTerminal, faXmark } from "@fortawesome/free-solid-svg-icons";
import Draggable, { DraggableEvent } from "react-draggable";
import { DraggableData } from "react-rnd";
import Topbar from "./Topbar/Topbar";
import { useTopbar } from "./Topbar/useTopbar";
import DatePicker from "./Taskbar/DatePicker";

interface PromptInterface {
  title: string;
  description: string;
  setPrompts: (prev: any) => void;
  onConfirm: () => void;
}

interface DesktopProps {
  setSignedIn: (prev: boolean) => void;
  setShowBootScreen: (prev: boolean) => void;
}

type CustomWindowContent = Record<string, File> | { title: string; content: App; path: string; };

const Desktop: React.FC<DesktopProps> = ({ setSignedIn, setShowBootScreen }) => {
  const [shortcutApps, setShortcutApps] = useState<Array<App>>([]);
  const [openedApps, setOpenedApps] = useState<Array<string>>([]);
  const [apps, setApps] = useState<Record<string, File | Folder>>({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [prompts, setPrompts] = useState<Array<PromptInterface>>([]);
  const [customWindowContent, setCustomWindowContent] = useState<Array<object>>([]);
  const [htmlCustomWindowContent, setHtmlCustomWindowContent] = useState<CustomWindowContent[]>([]);

  const [showFilePrompt, setShowFilePrompt] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [tray, setTray] = useState<boolean>(false);
  const [datepicker, setDatepicker] = useState<boolean>(false);
  const [helper, setHelper] = useState<boolean>(false);
  const [appTray, setAppTray] = useState<boolean>(false);
  const [bigMenu, setBigMenu] = useState<boolean>(false);

  const [file, setFile] = useState<File | unknown>(null);

  const [taskbar, setTaskbar] = useState<string>("full");
  const [currentFilePrompt, setCurrentFilePrompt] = useState<string>("Folder");
  const [path, setPath] = useState<string>("");
  const [dropDownName, setDropDownName] = useState<"New" | "Open With">("New");

  const { menuPosition, menuVisible, menuActions, dropDownActions, showMenu, hideMenu } = useContextMenu();
  const { addMenu, removeMenu } = useTopbar();
  const [fullscreened, setFullscreened] = useState<boolean>(false);

  useEffect(() => {
    const openSettings = () => {
      if (openedApps.includes("Settings")) return;

      setPath(String(0));
      setOpenedApps((prev) => [...prev, "Settings"]);
    };

    addMenu({
      title: "Main",
      icon: faMoon,
      dropdown: [
        { label: 'About', onClick: () => { window.document.location = "https://github.com/LuminesenceProject/LumiOS" }, icon: faQuestionCircle, gap: true },
        { label: "System", onClick: openSettings, icon: faGear, gap: true },
        { label: "Restart", onClick: () => window.location.reload(), icon: faRefresh },
        { label: "Logout", onClick: () => setSignedIn(false), icon: faArrowRightToBracket },
      ],
    });

    const addFile = async () => {
      const fileName = prompt("File name?");

      if (!fileName) return;

      virtualFS.writeFile("Desktop/", fileName, "");
      getShortcutApps();
    };

    const addFolder = async () => {
      const folderName = prompt("Folder name?");

      if (!folderName) return;

      virtualFS.writeFolder("Desktop/", folderName);
      getShortcutApps();
    }

    addMenu({
      title: "File",
      dropdown: [
        { label: "New File", onClick: addFile },
        { label: "New Folder", onClick: addFolder, gap: true },
      ],
    });

    const handleFullscreen = () => {
      if (!fullscreened) {
        document.body.requestFullscreen()
      } else {
        document
        .exitFullscreen()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(err));
      }

      setFullscreened(!fullscreened);      
    };

    addMenu({
      title: "Window",
      dropdown: [
        { label: `${!fullscreened ? "Fullscreen" : "Restore"}`, onClick: handleFullscreen },
        { label: "Close All", onClick: () => setOpenedApps([]), gap: true },
        { label: "Developer", onClick: () => setOpenedApps((prev) => [...prev, "Webtools"])},
        //{ label: "Mute", onClick: () => {} },
      ],
    });

    return () => {
      removeMenu("Main");
      removeMenu("File");
      removeMenu("Window");
    };
  }, [fullscreened]);

  const getShortcutApps = async () => {
    await virtualFS.initialize();
    const apps = await virtualFS.readdir("Apps");
    const desktopApps = await virtualFS.readdir("Desktop");

    function tryParseJSON(jsonString: string) {
      try {
          return JSON.parse(jsonString);
      } catch (error) {
          //console.error("Failed to parse JSON:", error);
          return null;
      }
    }

    async function getPosition(name: string) {
      const storedPosition = await virtualFS.readfile("System/Plugins/Positions/", name);

      if (!storedPosition) return { x: 0, y: 0 };

      const position = JSON.parse(storedPosition.content);
      
      return position;
    }
    
    const result = Object.keys(desktopApps).map((name) => {
      const app = desktopApps[name] as File;
      
      let parsed;
      if (typeof app.content === "string") {
          parsed = tryParseJSON(app.content);
          if (parsed === null) {
              // Handle the case where parsing failed, e.g., fallback to original content
              parsed = { content: app.content };
          }
      } else {
          parsed = app.content;
      }
              
      const newContent = {
        ...parsed,
        folder: app.type !== "file",
        type: app.fileType,
        altName: name,
      };      

      return newContent;
    });

    const positions: any = [];

    result.map(async (value) => {
      getPosition(value.name || value.altName).then(async (newVal) => {
        positions.push(await newVal);
      });
    });
  
    async function getAllPositions(result: any[]) {
      const positions = await Promise.all(result.map(value => getPosition(value.name || value.altName)));
    
      const newResult = result.map((value, index) => ({
        ...value,
        position: positions[index],
      }));
    
      return newResult;
    }
        
    setApps(apps);
    setShortcutApps(await getAllPositions(result));       
    
    // Code for taskbar
    const storedPosition = await virtualFS.readfile("System/Plugins", "Taskbar");
    setTaskbar(storedPosition.content);
  };
  
  useEffect(() => {
    getShortcutApps();
  }, []);

  useEffect(() => {
    const audio = new Audio(startup);
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    let lastKeyPressTime = 0;
    const doublePressThreshold = 200; // Adjust as needed, this is in milliseconds

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        const currentTime = new Date().getTime();
        if (currentTime - lastKeyPressTime < doublePressThreshold) {
          // Spacebar is clicked twice
          setBigMenu(true);
        }
        lastKeyPressTime = currentTime;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchStartup = async (): Promise<void> => {
      const startup = await virtualFS.readfile("System/Plugins", "Startup");

      if (startup) {
        const content = startup.content;

        try {
          eval(content);
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchStartup();
  }, []);

  // @ts-ignore
  function tryParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        //console.error("Failed to parse JSON:", error);
        return null;
    }
  }

  const handleAppClick = async (app: string, type: string | boolean) => {
    const allApps = await virtualFS.readdir("Desktop/");
    setPath("");
 
    if (type === "shrt") {
      const thisApp = Object.keys(allApps).find((allApp) => {
        const item = allApps[allApp];
        if (item.type === "file") {
          const appContent = JSON.parse(item.content);
          return appContent.name === app;
        }
        return false;
      });
      
      setOpenedApps((prev: any) => [...prev, thisApp]);
    } else if (type && typeof type !== "string") {
      setOpenedApps((prev: any) => [...prev, "FileExplorer"]);
      setPath(`/Desktop/${app}`);
    } else {
      const normalName = Object.keys(allApps).find((value: any) => {
        const item = allApps[value];
        if (item.type === "file") {
          const content = tryParseJSON(item.content);
          return content && content.name === app;
        }
        return false;
      }) || app;

      const desktopValues = await virtualFS.readdir("Desktop/");
      const value = desktopValues[normalName] as File;              
        
      setCustomWindowContent((prev) => [...prev, {
        title: app,
        content: value.content,
        path: "Desktop/",
      }]);
    }
  };

  const handleAppContextMenu = async (event: React.MouseEvent<HTMLDivElement>, app: string, type: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDropDownName("Open With");    

    const desktopApps = await virtualFS.readdir("Desktop/");
    
    const normalName = Object.keys(desktopApps).find((value: any) => {
      const item = desktopApps[value];
      if (item.type === "file") {
        const content = tryParseJSON(item.content);
        return content && content.name === app;
      }
      return false;
    }) || app;

    showMenu(event, app, {
      "Open": () => {
        handleAppClick(app, type);
        hideMenu();
      },
      // Dropdown menu here
      "Rename": async () => {
        const newName = false // prompt("New name?");
        if (!newName) return;

        await virtualFS.mv("Desktop/", "Desktop/", normalName, newName);
      },
      "Remove": async () => {
        // Find the index of the app by name
        const appNameToRemove = normalName; // Replace "Settings" with the actual app name        

        await virtualFS.deleteFile("Desktop", appNameToRemove);
        getShortcutApps();
        
        hideMenu();
      },
      // Add more actions as needed
    }, {
      "Viewer": async () => {
        // @ts-ignore
        const app: App = desktopApps[normalName].content;

        if (!app) return;        
                
        setHtmlCustomWindowContent((prev) => [
          ...prev,
          { title: normalName, content: app, path: "Desktop/" }
        ]);

        hideMenu();
      },
      "Editor": async () => {
        const desktopValues = await virtualFS.readdir("Desktop/");
        const value = desktopValues[normalName] as File;
        
        if (!value.content) return;        
          
        setCustomWindowContent((prev) => [...prev, {
          title: app,
          content: value.content,
          path: "Desktop/",
        }]);

        hideMenu();
      },
    });

    event.stopPropagation();
  };

  const handleDesktopContextMenu = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDropDownName("New");    

    showMenu(event, "Desktop", {
      "Refresh": async () => {
        await getShortcutApps();
        
        hideMenu();
      },
      "View Apps": () => {
        if (!openedApps.includes("InstalledApps")) {
          setOpenedApps((prev: Array<string>) => [...prev, "InstalledApps"]);
        }

        hideMenu();
      },
      "Personalize": () => {
        if (!openedApps.includes("Settings")) {
          setPath(String(1));
          setOpenedApps((prev: Array<string>) => [...prev, "Settings"]);
        }

        hideMenu();
      },
      "Terminal": async () => {
        if (!openedApps.includes("Terminal")) {
          setOpenedApps((prev: Array<string>) => [...prev, "Terminal"]);
        }
        hideMenu();
      },
    }, {
      "New File": async () => {
        const newFile = {
          title: "New File",
          content: "",
        };

        setCustomWindowContent((prev) => [...prev, newFile]);
        getShortcutApps();
        hideMenu();
      },
      "New Folder": async () => {
        const newFolderName = prompt("Folder name?");

        if (!newFolderName) return;

        await virtualFS.writeFolder("Desktop/", newFolderName);
        if (!openedApps.includes("FileExplorer")) {
          setPath(`Desktop/${newFolderName}/`);
          setOpenedApps((prev: Array<string>) => [...prev, "FileExplorer"]);
        }

        getShortcutApps();
        hideMenu();
      },
    });

    event.stopPropagation();
  };

  const handleDragStop = async (event: DraggableEvent, data: DraggableData, app: any) => {    
    event.preventDefault();
    const { x, y } = data;    

    await virtualFS.deleteFile("System/Plugins/Positions/", app.name || app.altName);
    await virtualFS.writeFile("System/Plugins/Positions/", app.name || app.altName, JSON.stringify({
      x: x,
      y: y,
    }));
  };

  return (
    <div className="relative w-full h-screen flex flex-row gap-2 flex-wrap overflow-hidden" onContextMenu={(e) => handleDesktopContextMenu(e)}>
      <Topbar openedApps={openedApps} />
      <div className="h-fit w-full flex gap-2 flex-wrap p-2 mt-10">
      {shortcutApps.map((app: any, index) => (
        <Draggable key={index} onStop={(event, data) => handleDragStop(event, data, app)} defaultPosition={ app.position }>
          <div
          onDoubleClick={() => handleAppClick(app.name || app.altName, app.type || app.folder)} 
          onContextMenu={(e) => handleAppContextMenu(e, app.name || app.altName, app.type || app.folder)}
          className="flex flex-col items-center justify-center gap-1 h-fit bg-primary hover:bg-secondary  duration-200 transition-colors cursor-pointer p-1 rounded shadow-sm"
          style={{ color: "white" }}>
              {app.type === "shrt" ? !app?.svg?.startsWith("data:image") ? (
                  <div dangerouslySetInnerHTML={{ __html: app.svg || "" }} className="invert w-10 h-10 p-2 rounded" />
              ) : (
                  <img src={app.svg || ""} alt={app.name || ""} className="cursor-pointer" />
              ) : !app.folder ? <div className="w-10 h-10 flex justify-center items-center">
                <FontAwesomeIcon icon={faFile} className="p-2 rounded w-10 h-10" />
              </div> : <div className="w-10 h-10 flex justify-center items-center">
                <FontAwesomeIcon icon={faFolderClosed} className="p-2 rounded w-10 h-10" />
              </div>}
              <h4 className="text-sm font-semibold">{ app.name || app.altName }</h4>
          </div>
        </Draggable>
      ))}
      </div>
      {openedApps.map((app, index) => {
        const Component = components[app];
        const content = apps[app] && apps[app].type === "file" && JSON.parse(apps[app].content);

        return (
          <Window setOpenedApps={setOpenedApps} openedApps={openedApps} title={app} key={index} id={app}>
            <React.Fragment>
              {Component ? (
                <Component
                  setOpenedApps={setOpenedApps}
                  openedApps={openedApps}
                  setPrompts={setPrompts}
                  setShowFilePrompt={setShowFilePrompt}
                  filePrompt={showFilePrompt}
                  path={app}
                  currentDir={path}
                  prePath={path}
                  setSelectedFiles={setSelectedFiles}
                  selectedFiles={selectedFiles}
                  setCustomWindowContent={setCustomWindowContent}
                  setHtmlCustomWindowContent={setHtmlCustomWindowContent}
                  file={file}
                  setCurrentFilePrompt={setCurrentFilePrompt}
                  setShowBootScreen={setShowBootScreen}
                />
              ) : (
                <HTMLFileViewer path={app} link={content?.fileContent} />
              )}
            </React.Fragment>
          </Window>
        );
      })}
      {customWindowContent.map((value: any, index: number) => (
        <Window title={value.title} setOpenedApps={setCustomWindowContent} openedApps={openedApps} id={value.title} key={index} custom={true}>
          <div className="resize h-full w-full !text-text-base">
            <Notepad setShowFilePrompt={setShowFilePrompt} filePrompt={showFilePrompt} currentDir={path} file={file} setCurrentFilePrompt={setCurrentFilePrompt} content={value.content} />
          </div>
        </Window>
      ))}
      {htmlCustomWindowContent.map((value: any, index: number) => {
        const content = value.content;
        
        return (
        <Window title={value.title} setOpenedApps={setHtmlCustomWindowContent} openedApps={openedApps} id={value.title} key={index} custom={true}>
          <div className="resize h-full w-full !text-text-base">
            <iframe className="w-full h-full" srcDoc={content || "<p>Loading...</p>"}>Iframe is blocked</iframe>
          </div>
        </Window>
      )})}
      <Menu setOpenedApps={setOpenedApps} setCustomWindowContent={setCustomWindowContent} setHtmlCustomWindowContent={setHtmlCustomWindowContent} setPath={setPath} shown={menu} pinnedApps={shortcutApps} setShown={setMenu} setSignedIn={setSignedIn} getPinnedApps={getShortcutApps} />
      <Tray shown={tray} openedApps={openedApps} setShown={setTray} taskbar={taskbar} />
      <AppTray shown={appTray} openedApps={openedApps} htmlOpenedApps={customWindowContent} setShown={setAppTray} setOpenedApps={setOpenedApps} setHTMLOpenedApps={setCustomWindowContent} />
      <DatePicker shown={datepicker} setShown={setDatepicker} />
      <Assistant shown={helper} openedApps={openedApps} htmlOpenedApps={customWindowContent} setShown={setHelper} setOpenedApps={setOpenedApps} setHTMLOpenedApps={setCustomWindowContent} />
      <Taskbar menu={menu} setMenu={setMenu} tray={tray} appTray={appTray} setTray={setTray} help={helper} setAppTray={setAppTray} setHelp={setHelper} setOpenedApps={setOpenedApps} datepicker={datepicker} setDatepicker={setDatepicker} openedApps={openedApps} />
      {menuVisible && (
        <ContextMenu menuPosition={menuPosition} menuActions={menuActions} hideMenu={hideMenu} dropDownName={dropDownName} menuDropdown={dropDownActions} emojis={dropDownName === "New" ? [faRefresh, faList, faPaintBrush, faTerminal, faFileCirclePlus, faFolderPlus] : [faArrowUpFromBracket, faPenToSquare, faXmark, faMagnifyingGlassPlus, faFilePen]} />
      )}
      {prompts.map((prompt: PromptInterface, index: number) => (
        <Prompt key={index} setPrompts={setPrompts} title={prompt.title} description={prompt.description} onConfirm={prompt.onConfirm} game={{}} />
      ))}
      {bigMenu && <BigSearch setShown={setBigMenu} handleAppClick={handleAppClick} />}
      {showFilePrompt && <FilePrompt setPath={setPath} setPrompts={setShowFilePrompt} currentFilePrompt={currentFilePrompt} setFile={setFile} />}
    </div>
  );
};

export default Desktop;