import React, { ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import virtualFS from "../../utils/VirtualFS";
import { App, File } from "../../utils/types";
import { faArrowUpFromBracket, faCaretUp, faRefresh, faRocket, faX } from "@fortawesome/free-solid-svg-icons";
import { useContextMenu } from "../ContextMenu/useContextMenu";
import logo from "../../assets/logo.jpeg";
import ContextMenu from "../ContextMenu/ContextMenu";
import Battery from "./Battery";
import Time from "./Time";
import Wifi from "./Wifi";

interface TaskbarProps {
    menu: boolean;
    tray: boolean;
    help: boolean;
    appTray: boolean;
    datepicker: boolean;
    openedApps: Array<string>;
    setOpenedApps: (prev: string[]) => void;
    setMenu: (prev: boolean) => void;
    setTray: (prev: boolean) => void;
    setAppTray: (prev: boolean) => void;
    setDatepicker: (prev: boolean) => void;
    setHelp: (prev: boolean) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ setOpenedApps, openedApps, setMenu, setTray, setAppTray, setHelp, appTray, menu, tray, help, datepicker, setDatepicker }) => {
    const [pinnedApps, setPinnedApps] = useState<Array<App>>([]);
    const [pinned, setPinned] = useState<Array<string>>([]);
    const [allApps, setAllApps] = useState({});
    const [taskbar, setTaskbar] = useState<"full" | "floating">("full");
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [appContext, setAppContext] = useState<boolean>(false);

    const { menuPosition, menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();
    const position = localStorage.getItem("position") || "south";
    
    // Get the pinned apps 
    const getPinnedApps = async () => {
      await virtualFS.initialize();
      const pinnedApps = await virtualFS.readdir("System/Taskbar");
      const allApps = await virtualFS.readdir("Apps/");
      
      const result = Object.keys(pinnedApps).map((name) => {
        const app = pinnedApps[name];

        return typeof app.content === "string" ? JSON.parse(app.content) : app.content;
      });
      
      setPinned(Object.keys(pinnedApps));
      setPinnedApps(result);
      setAllApps(allApps);

      // Code for taskbar
      const storedTaskbar = await virtualFS.readdir("System/Plugins/");
      const storedPosition = storedTaskbar["Taskbar"] as File;
      setTaskbar(await storedPosition.content);
    }

    useEffect(() => {
        getPinnedApps();
    }, []);

    const handleAppContextMenu = (event: React.MouseEvent<HTMLDivElement>, app: string) => {
        event.preventDefault();
        setAppContext(true);

        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("taskbar");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top - 150; // just to make sure it is not hidden
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        const handleAppClick = async (app: string) => {
            const allApps = await virtualFS.readdir("Apps");
          
            const thisApp = Object.keys(allApps).find(allApp => {
              const appContent = JSON.parse(allApps[allApp].content);
              return appContent.name === app;
            });
            
            setOpenedApps((prev: any) => [...prev, thisApp]);
        };

        showMenu(event, app, {
            "Open": () => {
              handleAppClick(app);
              hideMenu();
            },
            "Remove": async () => {
              const pinnedApps = await virtualFS.readdir("System/Taskbar");

              const pinnedApp = Object.keys(pinnedApps).find(value => {
                const parsed = typeof pinnedApps[value].content === "string" ? JSON.parse(pinnedApps[value].content) : pinnedApps[value].content;

                return parsed.name === app;
              });
              
              await virtualFS.deleteFile("System/Taskbar", pinnedApp as string);
      
              hideMenu();
            },
            // Add more actions as needed
          });

        console.log(menuPosition);
        

        event.stopPropagation();
    }

    const handleTaskbarContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setAppContext(false);

        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("taskbar");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top - 20; // just to make sure it is not hidden
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        showMenu(event, "taskbar", {
            "Refresh": async () => {
                getPinnedApps();

                hideMenu();
            }
        });

        event.stopPropagation();
    }

    const handleAppClick = async (app: string) => {    
      const thisApp = Object.keys(allApps).find(allApp => {
        const appContent = JSON.parse(allApps[allApp].content);
        return appContent.name === app;
      });
      
      
      if (!openedApps.includes(thisApp)) {
        setOpenedApps((prev: string[]) => [...prev, thisApp]);        
      } else {
        setOpenedApps((prev: string[]) => prev.filter(value => value !== thisApp));
      }
    };

    const HoverAnimation = ({ name, children }: { name: string, children: ReactNode }) => {
        const thisApp: string = Object.keys(allApps).find(allApp => {
          const appContent = JSON.parse(allApps[allApp].content);
          return appContent.name === name;
        });

        const isAppOpened = openedApps.includes(thisApp);   
      
        return (
          <div
            className={`group flex justify-center items-center hover:scale-105 hover:backdrop-brightness-200 active:scale-95 w-12 h-12 cursor-pointer transition-transform duration-200 ${isAppOpened ? 'border-b-2 border-primary-light' : ''}`}
            onContextMenu={(e) => handleAppContextMenu(e, name)}
            onClick={() => handleAppClick(name)}
            >
            <div className={`text-text-base pointer-events-none absolute z-50 bg-primary-light rounded px-2 ${position === "north" ? "origin-top translate-y-10" : "origin-bottom -translate-y-10"} origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100`}>
              <h2>{ name }</h2>
            </div>
            { children }
          </div>
        );
    };

    return ( 
        <div className={`flex  ${position === "north" ? "top-0 flex-row" : position === "south" ? "bottom-0 flex-row" : position === "west" ? "left-0 flex-col" : "right-0 flex-col"} ${taskbar === "full" ? "w-full" : "w-fit rounded mb-4"} left-0 right-0 mx-auto justify-between items-center gap-2 absolute text-white backdrop-blur-lg bg-opacity-80 backdrop-brightness-75 p-1 shadow z-10`} id="taskbar" onContextMenu={(e) => handleTaskbarContextMenu(e)}>
            <div className={`flex ${position === "north" ? "flex-row" : position === "south" ? "flex-row" : "flex-col"} gap-4 relative`}>
                <div className="group" onClick={() => setMenu(!menu)}>
                    <div className={`flex justify-center items-center hover:scale-105 w-12 h-12 cursor-pointer transition-transform duration-200`}>
                        <img src={logo} alt="Taskbar" className="group-hover:opacity-100"/>
                    </div>
                </div>
                <div className="group" onClick={() => setHelp(!help)}>
                  <div className={`hover:backdrop-brightness-200 duration-200 h-12 gap-2 justify-center items-center ml-auto hover:cursor-pointer rounded p-1 invert relative`}>
                    <div className="bg-primary hover:bg-primary-light duration-200 transition-colors p-1 py-2 invert rounded w-full h-full">
                        <FontAwesomeIcon icon={faRocket} className="invert w-8 h-8" />
                    </div>
                  </div>
                </div>
                {pinnedApps.map((app, index) => (
                    <HoverAnimation name={app.name} key={index}>
                        <>
                            {!app?.svg?.startsWith("data:image") && !app?.svg?.startsWith("https://") ? (
                                <div dangerouslySetInnerHTML={{ __html: app.svg }} className="cursor-pointer invert w-12 h-12 p-2 rounded" />
                            ) : (
                                <img src={app.svg} alt={app.name} className="h-5/6 w-5/6 object-cover" />
                            )}
                        </>
                    </HoverAnimation>
                ))}
                {openedApps.filter(app => !pinned.includes(app)).map((app, index) => {
                  let parsedContent = allApps[app] && JSON.parse(allApps[app].content);

                  if (!parsedContent) {
                    parsedContent = {
                      name: app,
                      description: "",
                      userInstalled: false,
                      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`
                    };
                  }
            
                  return (
                    <HoverAnimation name={parsedContent.name} key={index}>
                      <>
                          {!parsedContent.svg.startsWith("data:image") && !parsedContent.svg.startsWith("https://") ? (
                              <div dangerouslySetInnerHTML={{ __html: parsedContent.svg }} className="cursor-pointer invert w-12 h-12 p-2 rounded" />
                          ) : (
                              <img src={parsedContent.svg} alt={parsedContent.name} className="h-5/6 w-5/6 object-cover" />
                          )}
                      </>
                  </HoverAnimation>
                )})}
            </div>
            <div className={`flex ${position === "north" ? "flex-row" : position === "south" ? "flex-row" : "flex-col"} hover:backdrop-brightness-200 duration-200 h-12 gap-2 justify-center items-center ml-auto hover:cursor-pointer rounded p-1 invert relative`} onClick={() => {}}>
                <div className="bg-primary hover:bg-primary-light duration-200 transition-colors p-1 py-2 invert rounded" onClick={() => setAppTray(!appTray)}>
                    <FontAwesomeIcon icon={faCaretUp} className="invert" />
                </div>
                <div className="flex flex-row justify-center items-center font-bold invert bg-primary hover:bg-primary-light duration-200 transition-colors rounded p-2 shadow-sm gap-4" onClick={() => setTray(!tray)}>
                  <Battery />
                  <Wifi />
                </div>
                <div className="flex flex-row justify-center items-center font-bold rounded p-2 shadow-sm gap-4" onClick={() => setDatepicker(!datepicker)}>
                  <Time />
                </div>            
              </div>
            {menuVisible && (
                <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} emojis={appContext ? [faArrowUpFromBracket, faX] : [faRefresh]} />
            )}
        </div>
    );
}
 
export default Taskbar;