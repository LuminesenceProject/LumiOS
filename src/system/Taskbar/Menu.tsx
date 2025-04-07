import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { App, File } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faArrowUpFromBracket, faFile, faFilePen, faFolderClosed, faMagnifyingGlassPlus, faPenToSquare, faPowerOff, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContextMenu } from "../ContextMenu/useContextMenu";
import { openedApps } from "../../utils/process";
import ContextMenu from "../ContextMenu/ContextMenu";
import virtualFS from "../../utils/VirtualFS";
import Button from "../../structures/Button";
import { saveStamp } from "../../structures/Timestamp";

type CustomWindowContent = Record<string, File> | { title: string; content: App; path: string; };

interface MenuProps {
    setOpenedApps: (prev: Array<string>) => void;
    setCustomWindowContent: (prev: CustomWindowContent[]) => void;
    setHtmlCustomWindowContent: (prev: CustomWindowContent[]) => void;
    pinnedApps: Array<App>;
    shown: boolean;
    setPath: (prev: string) => void;
    setShown: (prev: boolean) => void;
    setSignedIn: (prev: boolean) => void;
    getPinnedApps: () => void;
}

const Menu: React.FC<MenuProps> = ({ setOpenedApps, setCustomWindowContent, setHtmlCustomWindowContent, shown, pinnedApps, getPinnedApps, setShown, setPath, setSignedIn }) => {
    const [apps, setApps] = useState<Array<App>>([]);
    const [search, setSearch] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const { menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();
    const [dropDownName, setDropDownName] = useState<string>("New File");

    const menuRef = useRef(null);

    useLayoutEffect(() => {
        const fetchApps = async () => {
          const apps = await virtualFS.readdir("Apps");

          const result = Object.keys(apps).map((name) => {
            const app = apps[name] as File;
            
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
            }
      
            return newContent;
          });

          setApps(result);          
        }

        fetchApps();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            // Stamp
            shown && saveStamp({
              app: "Menu",
              content: {
                shown: shown,
                input: input,
                search: search,
              },
              openedApps: openedApps
            });

            setShown(false);
            setInput("");
          }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
      setSearch(false);
    }, [shown]);

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
      const allApps = await virtualFS.readdir("Apps/");
      setPath("");

      const normalName = Object.keys(allApps).find((value: any) => {
        const item = allApps[value];
        if (item.type === "file") {
          const content = tryParseJSON(item.content);
          return content && content.name === app;
        }
        return false;
      }) || app;
   
      if (["app", "html", "shrt"].includes(type.toString())) {
        setOpenedApps((prev) => [...prev, normalName]);
      } else if (type && typeof type !== "string") {
        setOpenedApps((prev) => [...prev, "FileExplorer"]);
        setPath(`/Desktop/${app}`);        
      } else {  
        const desktopValues = await virtualFS.readdir("Desktop/");
        const value = desktopValues[normalName] as File;             

        setCustomWindowContent((prev) => [...prev, {
          title: app,
          content: value.content,
          path: "Desktop/",
        }]);
      }

      setShown(false);
    };
  
    const handleAppContextMenu = async (event: React.MouseEvent<HTMLDivElement>, app: string, type: string) => {
      event.preventDefault();
      event.stopPropagation();

      // Get the position relative to the window
      const x = event.clientX;
      const y = event.clientY;
  
      // Get the bounding client rect of the parent component
      const rect = document.getElementById("menu");
      const bounds = rect?.getBoundingClientRect();
  
      if (bounds) {
          // Calculate the relative position within the bounding rectangle
          const relativeX = x - bounds.left;
          const relativeY = y - bounds.top;
  
          // Update the state variable with the adjusted menu position
          setUpdatedMenuPosition({ x: relativeX, y: relativeY });
      }

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
        "Rename": async () => {
          const newName = false; // prompt("New name?");
          if (!newName) return;
  
          await virtualFS.mv("Desktop/", "Desktop/", normalName, newName);
        },
        "Remove": async () => {
          // Find the index of the app by name
          const appNameToRemove = app; // Replace "Settings" with the actual app name
  
          await virtualFS.deleteFile("Desktop", appNameToRemove);
          
          getPinnedApps();
          hideMenu();
        },
        // Add more actions as needed
      }, {
        "Viewer": async () => {
          // @ts-ignore
          const app: App = desktopApps[normalName].content;
                  
          setHtmlCustomWindowContent((prev) => [...prev, { title: normalName, content: app, path: "Desktop/" }]);
          hideMenu();
        },
        "Editor": async () => {
          const desktopValues = await virtualFS.readdir("Desktop/");
          const value = desktopValues[normalName] as File;              
            
          // @ts-ignore
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

    return (
      <div
      ref={menuRef}
      id="menu"
      className={`${
          shown ? "scale-100 pointer-events-auto" : "scale-0 pointer-events-none"
      } transition-transform duration-200 absolute -translate-y-20 backdrop-blur-lg w-1/3 h-1/2 origin-bottom p-2 z-30 overflow-hidden`}
      style={{ bottom: 0, backdropFilter: "blur(20px)", color: "white" }}
  >
      <div className={`transition-all duration-300 ${search ? 'transform -translate-x-full opacity-0 h-0' : 'transform translate-x-0 opacity-100 h-full'}`}>
          <div className="font-bold text-lg">
              <div className="flex flex-row justify-between items-center">
                  <h2>Pinned</h2>
                  <div className="flex flex-row items-center gap-2">
                      <FontAwesomeIcon icon={faPowerOff} onClick={() => setSignedIn(false)} className="cursor-pointer hover:bg-primary duration-200 transition-colors p-2 rounded hover:shadow-sm" />
                      <Button onClick={() => { setSearch(true) }} className="!px-1 !py-1 flex flex-row">All Apps <FontAwesomeIcon icon={faArrowRight} /></Button>
                  </div>
              </div>
              <div className="flex flex-row gap-2 p-2">
                  {pinnedApps.slice(0, 9).map((app: any, index) => (
                      <div
                          key={index}
                          onClick={() => handleAppClick(app.altName, app.type || app.folder)}
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
                          <h4 className="text-sm font-semibold">{app.name || app.altName}</h4>
                      </div>
                  ))}
              </div>
          </div>
          <div className="font-bold text-2xl">
              <h2>Recommended</h2>
              <div className="flex flex-row gap-2 p-2">
                  {apps.slice(0, 4).map((app: any, index) => (
                      <div
                          key={index}
                          onClick={() => handleAppClick(app.name || app.altName, app.type || app.folder)}
                          onContextMenu={(e) => handleAppContextMenu(e, app.name || app.altName, app.type || app.folder)}
                          className="flex flex-col items-center justify-center gap-1 h-fit bg-primary hover:bg-secondary  duration-200 transition-colors cursor-pointer p-1 rounded shadow-sm"
                          style={{ color: "white" }}>
                          {app.type === "app" ? !app?.svg?.startsWith("data:image") ? (
                              <div dangerouslySetInnerHTML={{ __html: app.svg || "" }} className="invert w-10 h-10 p-2 rounded" />
                          ) : (
                              <img src={app.svg || ""} alt={app.name || ""} className="cursor-pointer" />
                          ) : !app.folder ? <div className="w-10 h-10 flex justify-center items-center">
                              <FontAwesomeIcon icon={faFile} className="p-2 rounded w-10 h-10" />
                          </div> : <div className="w-10 h-10 flex justify-center items-center">
                              <FontAwesomeIcon icon={faFolderClosed} className="p-2 rounded w-10 h-10" />
                          </div>}
                          <h4 className="text-sm font-semibold">{app.name || app.altName}</h4>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      <div className={`transition-all duration-300 ${search ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}>
          <div className="flex flex-row justify-between items-center">
              <h2 className="font-bold text-2xl">Apps</h2>
              <Button onClick={() => { setSearch(false) }} className="!px-1 !py-1 flex flex-row"><FontAwesomeIcon icon={faArrowLeft} /> Back</Button>
          </div>
          <input className="input-main flex-grow px-4 my-2" placeholder="Search Apps..." onChange={(e) => setInput(e.target.value)} />
          <div className="flex flex-col gap-2 w-full overflow-y-auto">
              {input && apps.filter(app => app.name.toLowerCase().includes(input.toLowerCase())).map((app, index) => (
                  <div
                      key={index}
                      onClick={() => handleAppClick(app.name || app.altName, app.type || app.folder)}
                      onContextMenu={(e) => handleAppContextMenu(e, app.name || app.altName, app.type || app.folder)}
                      className="flex flex-col items-center justify-center gap-1 h-fit bg-primary hover:bg-secondary  duration-200 transition-colors cursor-pointer p-1 rounded shadow-sm"
                      style={{ color: "white" }}>
                      {app.type === "app" ? !app?.svg?.startsWith("data:image") ? (
                          <div dangerouslySetInnerHTML={{ __html: app.svg || "" }} className="invert w-10 h-10 p-2 rounded" />
                      ) : (
                          <img src={app.svg || ""} alt={app.name || ""} className="cursor-pointer" />
                      ) : !app.folder ? <div className="w-10 h-10 flex justify-center items-center">
                          <FontAwesomeIcon icon={faFile} className="p-2 rounded w-10 h-10" />
                      </div> : <div className="w-10 h-10 flex justify-center items-center">
                          <FontAwesomeIcon icon={faFolderClosed} className="p-2 rounded w-10 h-10" />
                      </div>}
                      <h4 className="text-sm font-semibold">{app.name || app.altName}</h4>
                  </div>
              ))}
          </div>
      </div>
      {menuVisible && (
        <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} dropDownName={dropDownName} emojis={[faArrowUpFromBracket, faPenToSquare, faXmark, faMagnifyingGlassPlus, faFilePen]} />
      )}
    </div>
    );
};

export default Menu;